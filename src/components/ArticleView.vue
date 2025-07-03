<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="max-w-4xl mx-auto">
      <div class="animate-pulse">
        <!-- Back button skeleton -->
        <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-6"></div>
        
        <!-- Article header skeleton -->
        <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-6">
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div class="flex space-x-4 mb-4">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          </div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
        
        <!-- Content skeleton -->
        <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div class="space-y-3">
            <div v-for="n in 8" :key="n" class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-4xl mx-auto">
      <div class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
        <svg class="flex-shrink-0 inline w-4 h-4 me-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <div>
          <span class="font-medium">Error:</span> {{ error }}
        </div>
      </div>
      
      <router-link to="/" 
                   class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-primary-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
        <svg class="w-3.5 h-3.5 me-2.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0L2.586 11a2 2 0 010-2.828l3.707-3.707a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
        </svg>
        Back to Home
      </router-link>
    </div>

    <!-- Article Content -->
    <div v-else-if="article" class="max-w-4xl mx-auto">
      <!-- Back Navigation -->
      <div class="mb-6">
        <router-link to="/" 
                     class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-primary-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700 transition-colors">
          <svg class="w-3.5 h-3.5 me-2.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0L2.586 11a2 2 0 010-2.828l3.707-3.707a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l3.293 3.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
          </svg>
          Back to Feed
        </router-link>
      </div>

      <!-- Article Header -->
      <article class="p-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-6">
        <header class="mb-6">
          <h1 class="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
            {{ article.title }}
          </h1>
          
          <!-- Article Meta -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <div v-if="article.author" class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
              <span class="font-medium">{{ article.author }}</span>
            </div>
            
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
              </svg>
              <time>{{ formatDate(article.pubDate) }}</time>
            </div>
            
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"/>
              </svg>
              <span>{{ getDomain(article.link) }}</span>
            </div>
          </div>

          <!-- Article Summary -->
          <div v-if="article.description" class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-primary-500">
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed" v-html="cleanDescription(article.description)"></p>
          </div>
        </header>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-3 mb-6">
          <a :href="article.link" 
             target="_blank" 
             class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition-colors">
            <svg class="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
            Read Original Article
          </a>
          
          <button @click="shareArticle" 
                  class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition-colors">
            <svg class="w-4 h-4 me-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
            </svg>
            Share Article
          </button>
        </div>

        <!-- Article Content -->
        <div class="prose prose-lg max-w-none dark:prose-invert">
          <div v-if="article.content" v-html="cleanContent(article.content)" class="article-content"></div>
          <div v-else-if="article.description" v-html="cleanDescription(article.description)" class="article-content"></div>
          <div v-else class="text-gray-500 dark:text-gray-400 italic">
            No content preview available. Please click "Read Original Article" to view the full content.
          </div>
        </div>
      </article>

      <!-- Related Actions -->
      <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-6">
        <h3 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Article Actions</h3>
        <div class="flex flex-wrap gap-3">
          <a :href="article.link" 
             target="_blank"
             class="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 font-medium text-sm transition-colors">
            View on {{ getDomain(article.link) }} →
          </a>
          <button @click="copyLink" 
                  class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 font-medium text-sm transition-colors">
            Copy Link
          </button>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <Comments :article-url="article.link" @comment-added="onCommentAdded" @comment-deleted="onCommentDeleted" />
      </div>
    </div>
  </div>
</template>

<script>
import Comments from './Comments.vue'

export default {
  name: 'ArticleView',
  components: { Comments },
  data() {
    return {
      article: null,
      loading: true,
      error: null
    }
  },
  async mounted() {
    await this.loadArticle()
  },
  watch: {
    '$route'() {
      this.loadArticle()
    }
  },
  methods: {
    async loadArticle() {
      this.loading = true
      this.error = null
      
      try {
        // Get article data from route params or localStorage
        const articleData = this.$route.params.article || localStorage.getItem(`article-${this.$route.params.id}`)
        
        if (articleData) {
          if (typeof articleData === 'string') {
            this.article = JSON.parse(articleData)
          } else {
            this.article = articleData
          }
        } else {
          throw new Error('Article not found')
        }
      } catch (err) {
        this.error = err.message || 'Failed to load article'
      } finally {
        this.loading = false
      }
    },
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(date))
    },
    getDomain(url) {
      try {
        return new URL(url).hostname.replace('www.', '')
      } catch {
        return 'unknown'
      }
    },
    cleanDescription(html) {
      if (!html) return ''
      // Basic HTML cleaning - remove scripts and dangerous tags
      return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    },
    cleanContent(html) {
      if (!html) return ''
      // More aggressive cleaning for content
      return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
                .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
    },
    shareArticle() {
      if (navigator.share) {
        navigator.share({
          title: this.article.title,
          text: this.article.description,
          url: this.article.link
        })
      } else {
        // Fallback: copy to clipboard
        this.copyLink()
      }
    },
    copyLink() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.article.link).then(() => {
          // Could add a toast notification here
          console.log('Link copied to clipboard')
        })
      }
    },
    onCommentAdded(commentCount) {
      // Handle comment added event - could show a toast or update UI
      console.log(`Comment added. Total comments: ${commentCount}`)
    },
    onCommentDeleted(commentCount) {
      // Handle comment deleted event - could show a toast or update UI
      console.log(`Comment deleted. Total comments: ${commentCount}`)
    }
  }
}
</script>

<style scoped>
.article-content {
  line-height: 1.7;
}

.article-content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

.article-content a {
  color: rgb(37 99 235);
  text-decoration: underline;
}

.article-content a:hover {
  color: rgb(29 78 216);
}

.dark .article-content a {
  color: rgb(96 165 250);
}

.dark .article-content a:hover {
  color: rgb(147 197 253);
}
</style>