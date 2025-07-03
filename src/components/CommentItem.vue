<template>
  <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 mt-2">
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ comment.author }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatDate(comment.timestamp) }}
            <span v-if="comment.edited" class="ml-1 italic">(edited)</span>
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="$emit('start-edit', comment)"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          title="Edit comment">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button 
          @click="$emit('delete-comment', comment.id)"
          class="text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
          title="Delete comment">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button 
          @click="showReply = !showReply"
          class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 font-medium text-xs transition-colors"
          title="Reply">
          Reply
        </button>
      </div>
    </div>

    <!-- Content or Edit -->
    <div v-if="isEditing" class="space-y-3">
      <textarea 
        :value="editText"
        @input="$emit('update:edit-text', $event.target.value)"
        rows="3"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
      </textarea>
      <div class="flex items-center space-x-2">
        <button 
          @click="$emit('save-edit')"
          class="add-comment-btn inline-flex items-center px-6 py-3 text-base font-bold text-center rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          Update Comment
        </button>
        <button 
          @click="$emit('cancel-edit')"
          class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-center text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
          Cancel
        </button>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ comment.text }}</p>
    </div>

    <!-- Reply form -->
    <div v-if="showReply && !isEditing" class="mt-3 space-y-2">
      <input 
        v-model="replyAuthor"
        placeholder="Your Name (optional)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
      <textarea 
        v-model="replyText"
        rows="2"
        placeholder="Write a reply..."
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
      </textarea>
      <div class="flex items-center space-x-2">
        <button 
          @click="handleReply"
          class="add-comment-btn inline-flex items-center px-6 py-3 text-base font-bold text-center rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          Reply
        </button>
        <button 
          @click="showReply = false"
          class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-center text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
          Cancel
        </button>
      </div>
    </div>

    <!-- Render replies recursively -->
    <div v-if="comment.replies && comment.replies.length" class="pl-6 border-l-2 border-primary-100 dark:border-primary-900 mt-2">
      <CommentItem
        v-for="reply in comment.replies"
        :key="reply.id"
        :comment="reply"
        :article-url="articleUrl"
        :editing-comment="editingComment"
        :edit-text="editText"
        :format-date="formatDate"
        @start-edit="$emit('start-edit', $event)"
        @save-edit="$emit('save-edit')"
        @cancel-edit="$emit('cancel-edit')"
        @delete-comment="$emit('delete-comment', $event)"
        @add-reply="$emit('add-reply', $event.parentId, $event.text, $event.author)"
        @update:edit-text="$emit('update:edit-text', $event)"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleUrl: {
      type: String,
      required: true
    },
    editingComment: {
      type: Object,
      default: null
    },
    editText: {
      type: String,
      default: ''
    },
    formatDate: {
      type: Function,
      required: true
    }
  },
  emits: ['start-edit', 'save-edit', 'cancel-edit', 'delete-comment', 'add-reply', 'update:edit-text'],
  data() {
    return {
      showReply: false,
      replyText: '',
      replyAuthor: ''
    }
  },
  computed: {
    isEditing() {
      return this.editingComment && this.editingComment.id === this.comment.id
    }
  },
  methods: {
    handleReply() {
      if (!this.replyText.trim()) return
      this.$emit('add-reply', this.comment.id, this.replyText, this.replyAuthor)
      this.replyText = ''
      this.replyAuthor = ''
      this.showReply = false
    }
  }
}
</script>