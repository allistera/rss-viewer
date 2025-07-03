import { defineStore } from 'pinia'

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    // All comments stored by article URL
    comments: new Map(),
    
    // Loading states for comment operations
    loadingStates: new Map(),
    
    // Error states for comment operations
    errorStates: new Map()
  }),

  getters: {
    // Get comments for a specific article
    getComments: (state) => (articleUrl) => {
      return state.comments.get(articleUrl) || []
    },

    // Get comment count for a specific article
    getCommentCount: (state) => (articleUrl) => {
      const comments = state.comments.get(articleUrl) || []
      return comments.length
    },

    // Get loading state for a specific article
    isLoading: (state) => (articleUrl) => {
      return state.loadingStates.get(articleUrl) || false
    },

    // Get error state for a specific article
    getError: (state) => (articleUrl) => {
      return state.errorStates.get(articleUrl) || null
    },

    // Get total comment count across all articles
    totalCommentCount: (state) => {
      let total = 0
      for (const comments of state.comments.values()) {
        total += comments.length
      }
      return total
    },

    // Get articles with comments
    articlesWithComments: (state) => {
      return Array.from(state.comments.keys()).filter(articleUrl => {
        const comments = state.comments.get(articleUrl) || []
        return comments.length > 0
      })
    }
  },

  actions: {
    // Load comments from localStorage
    loadComments() {
      try {
        const stored = localStorage.getItem('rss-comments')
        if (stored) {
          const parsedComments = JSON.parse(stored)
          this.comments = new Map(Object.entries(parsedComments))
        }
      } catch (error) {
        console.error('Error loading comments from localStorage:', error)
        this.comments = new Map()
      }
    },

    // Save comments to localStorage
    saveComments() {
      try {
        const commentsObj = Object.fromEntries(this.comments)
        localStorage.setItem('rss-comments', JSON.stringify(commentsObj))
      } catch (error) {
        console.error('Error saving comments to localStorage:', error)
        throw new Error('Failed to save comments')
      }
    },

    // Add a new comment
    addComment(articleUrl, commentData) {
      this.loadingStates.set(articleUrl, true)
      this.errorStates.delete(articleUrl)

      try {
        // Ensure comments are loaded
        if (!this.comments.has(articleUrl)) {
          this.loadComments()
        }

        const comments = this.comments.get(articleUrl) || []
        
        const newComment = {
          id: Date.now().toString(),
          text: commentData.text,
          author: commentData.author || 'Anonymous',
          timestamp: new Date().toISOString(),
          edited: false,
          editedAt: null,
          replies: [] // Nested replies
        }

        // If this is a reply to another comment
        if (commentData.parentId) {
          // Helper to add reply recursively
          const addReply = (commentsArr) => {
            for (const c of commentsArr) {
              if (c.id === commentData.parentId) {
                c.replies = c.replies || []
                c.replies.push(newComment)
                return true
              } else if (c.replies && c.replies.length) {
                if (addReply(c.replies)) return true
              }
            }
            return false
          }
          addReply(comments)
          this.comments.set(articleUrl, comments)
        } else {
          const updatedComments = [...comments, newComment]
          this.comments.set(articleUrl, updatedComments)
        }
        this.saveComments()
        return newComment
      } catch (error) {
        this.errorStates.set(articleUrl, error.message)
        throw error
      } finally {
        this.loadingStates.set(articleUrl, false)
      }
    },

    // Edit an existing comment (supports nested)
    editComment(articleUrl, commentId, newText) {
      this.loadingStates.set(articleUrl, true)
      this.errorStates.delete(articleUrl)

      try {
        const comments = this.comments.get(articleUrl) || []
        let updated = null
        // Helper to edit recursively
        const editRecursive = (arr) => {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === commentId) {
              arr[i] = {
                ...arr[i],
                text: newText,
                edited: true,
                editedAt: new Date().toISOString()
              }
              updated = arr[i]
              return true
            } else if (arr[i].replies && arr[i].replies.length) {
              if (editRecursive(arr[i].replies)) return true
            }
          }
          return false
        }
        editRecursive(comments)
        this.comments.set(articleUrl, comments)
        this.saveComments()
        return updated
      } catch (error) {
        this.errorStates.set(articleUrl, error.message)
        throw error
      } finally {
        this.loadingStates.set(articleUrl, false)
      }
    },

    // Delete a comment (supports nested)
    deleteComment(articleUrl, commentId) {
      this.loadingStates.set(articleUrl, true)
      this.errorStates.delete(articleUrl)

      try {
        const comments = this.comments.get(articleUrl) || []
        let deleted = false
        // Helper to delete recursively
        const deleteRecursive = (arr) => {
          for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i].id === commentId) {
              arr.splice(i, 1)
              deleted = true
            } else if (arr[i].replies && arr[i].replies.length) {
              deleteRecursive(arr[i].replies)
            }
          }
        }
        deleteRecursive(comments)
        this.comments.set(articleUrl, comments)
        this.saveComments()
        if (!deleted) throw new Error('Comment not found')
        return true
      } catch (error) {
        this.errorStates.set(articleUrl, error.message)
        throw error
      } finally {
        this.loadingStates.set(articleUrl, false)
      }
    },

    // Delete all comments for an article
    deleteAllComments(articleUrl) {
      this.loadingStates.set(articleUrl, true)
      this.errorStates.delete(articleUrl)

      try {
        this.comments.delete(articleUrl)
        this.saveComments()
        return true
      } catch (error) {
        this.errorStates.set(articleUrl, error.message)
        throw error
      } finally {
        this.loadingStates.set(articleUrl, false)
      }
    },

    // Clear all comments
    clearAllComments() {
      try {
        this.comments.clear()
        this.loadingStates.clear()
        this.errorStates.clear()
        localStorage.removeItem('rss-comments')
        return true
      } catch (error) {
        console.error('Error clearing comments:', error)
        throw new Error('Failed to clear comments')
      }
    },

    // Initialize the store
    initialize() {
      this.loadComments()
    }
  }
})