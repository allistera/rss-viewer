<template>
  <div class="comments-section">
    <!-- Comments Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white">
        Comments ({{ comments.length }})
      </h3>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Share your thoughts about this article
      </div>
    </div>

    <!-- Add Comment Form -->
    <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <div class="mb-4">
        <label for="author-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Your Name (optional)
        </label>
        <input v-model="newComment.author" 
               id="author-input"
               type="text" 
               placeholder="Enter your name or leave blank for Anonymous"
               class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
      </div>
      
      <div class="mb-4">
        <label for="comment-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Your Comment *
        </label>
        <textarea v-model="newComment.text" 
                  id="comment-input"
                  rows="3" 
                  placeholder="Share your thoughts about this article..."
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required></textarea>
      </div>
      
      <div class="flex items-center justify-between">
        <div class="text-xs text-gray-500 dark:text-gray-400">
          Comments are stored locally in your browser
        </div>
        <button @click="addComment" 
                :disabled="!newComment.text.trim()"
                class="add-comment-btn inline-flex items-center px-6 py-3 text-base font-bold text-center rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Add Comment
        </button>
      </div>
    </div>

    <!-- Comments List -->
    <div v-if="comments.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
      <svg class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
      <p class="text-lg font-medium mb-2">No comments yet</p>
      <p class="text-sm">Be the first to share your thoughts about this article!</p>
    </div>

    <div v-else class="space-y-4">
      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :article-url="articleUrl"
        :editing-comment="editingComment"
        :edit-text="editText"
        @start-edit="startEdit"
        @save-edit="saveEdit"
        @cancel-edit="cancelEdit"
        @delete-comment="deleteComment"
        @add-reply="addReply"
        :format-date="formatDate"
      />
    </div>
  </div>
</template>

<script>
import { useCommentsStore } from '../stores/comments.js'
import { computed, ref, onMounted } from 'vue'
import CommentItem from './CommentItem.vue'

export default {
  name: 'Comments',
  components: {
    CommentItem
  },
  props: {
    articleUrl: {
      type: String,
      required: true
    }
  },
  emits: ['comment-added', 'comment-deleted'],
  setup(props, { emit }) {
    const commentsStore = useCommentsStore()
    
    // Reactive data
    const newComment = ref({
      text: '',
      author: ''
    })
    const editingComment = ref(null)
    const editText = ref('')

    // Computed properties from store
    const comments = computed(() => commentsStore.getComments(props.articleUrl))
    const isLoading = computed(() => commentsStore.isLoading(props.articleUrl))
    const error = computed(() => commentsStore.getError(props.articleUrl))

    // Initialize store on mount
    onMounted(() => {
      commentsStore.initialize()
    })

    const addComment = async () => {
      if (!newComment.value.text.trim()) return
      try {
        await commentsStore.addComment(props.articleUrl, {
          text: newComment.value.text.trim(),
          author: newComment.value.author.trim() || 'Anonymous'
        })
        newComment.value = { text: '', author: '' }
        emit('comment-added', comments.value.length)
      } catch (error) {
        console.error('Error adding comment:', error)
      }
    }

    // Add reply to a comment
    const addReply = async (parentId, text, author) => {
      if (!text.trim()) return
      try {
        await commentsStore.addComment(props.articleUrl, {
          text: text.trim(),
          author: author.trim() || 'Anonymous',
          parentId
        })
        emit('comment-added', comments.value.length)
      } catch (error) {
        console.error('Error adding reply:', error)
      }
    }

    const startEdit = (comment) => {
      editingComment.value = comment
      editText.value = comment.text
    }

    const saveEdit = async () => {
      if (!editText.value.trim()) return

      try {
        await commentsStore.editComment(
          props.articleUrl, 
          editingComment.value.id, 
          editText.value.trim()
        )

        cancelEdit()
      } catch (error) {
        console.error('Error editing comment:', error)
      }
    }

    const cancelEdit = () => {
      editingComment.value = null
      editText.value = ''
    }

    const deleteComment = async (commentId) => {
      if (confirm('Are you sure you want to delete this comment?')) {
        try {
          await commentsStore.deleteComment(props.articleUrl, commentId)
          
          // Emit event to parent to update comment count
          emit('comment-deleted', comments.value.length)
        } catch (error) {
          console.error('Error deleting comment:', error)
        }
      }
    }

    const formatDate = (timestamp) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diff = now - date

      // Less than 1 minute
      if (diff < 60000) {
        return 'Just now'
      }
      
      // Less than 1 hour
      if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000)
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
      }
      
      // Less than 24 hours
      if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000)
        return `${hours} hour${hours > 1 ? 's' : ''} ago`
      }
      
      // Less than 7 days
      if (diff < 604800000) {
        const days = Math.floor(diff / 86400000)
        return `${days} day${days > 1 ? 's' : ''} ago`
      }
      
      // More than 7 days - show date
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    return {
      comments,
      isLoading,
      error,
      newComment,
      editingComment,
      editText,
      addComment,
      addReply,
      startEdit,
      saveEdit,
      cancelEdit,
      deleteComment,
      formatDate
    }
  }
}
</script>

<style scoped>
.comments-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.dark .comments-section {
  border-top-color: #374151;
}
</style>