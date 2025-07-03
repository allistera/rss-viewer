<template>
  <div>
    <!-- Loading State with Flowbite Skeleton -->
    <div v-if="loading">
      <!-- Feed Header Skeleton -->
      <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-6 animate-pulse">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="h-8 bg-gray-200 rounded-lg dark:bg-gray-700 w-2/3 mb-3"></div>
            <div class="h-4 bg-gray-200 rounded dark:bg-gray-700 w-1/2"></div>
          </div>
          <div class="h-6 bg-gray-200 rounded dark:bg-gray-700 w-20"></div>
        </div>
      </div>

      <!-- Article Skeletons -->
      <div class="space-y-4">
        <div v-for="n in 6" :key="n" class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 animate-pulse">
          <div class="flex items-start space-x-4">
            <div class="w-10 h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div class="flex-1 space-y-3">
              <div class="space-y-2">
                <div class="h-6 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
                <div class="h-6 bg-gray-200 rounded dark:bg-gray-700 w-4/5"></div>
              </div>
              <div class="flex space-x-4">
                <div class="h-4 bg-gray-200 rounded dark:bg-gray-700 w-16"></div>
                <div class="h-4 bg-gray-200 rounded dark:bg-gray-700 w-20"></div>
                <div class="h-4 bg-gray-200 rounded dark:bg-gray-700 w-24"></div>
              </div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full"></div>
                <div class="h-4 bg-gray-200 rounded dark:bg-gray-700 w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-else-if="error" class="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
      <svg class="flex-shrink-0 inline w-4 h-4 me-3" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <div>
        <span class="font-medium">Error loading feed:</span> {{ error }}
      </div>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Feed Header Card -->
      <div class="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{{ feed.title }}</h1>
            <p class="font-normal text-gray-700 dark:text-gray-400">{{ feed.description }}</p>
          </div>
          <div class="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ feed.items.length }} articles</span>
          </div>
        </div>
      </div>
      
      <!-- Articles List -->
      <div class="space-y-4">
        <article v-for="(item, index) in feed.items" :key="item.link" 
                 class="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors">
          <div class="flex items-start space-x-4">
            <!-- Article Number Badge -->
            <div class="flex items-center justify-center w-10 h-10 text-xs font-medium text-primary-800 bg-primary-100 rounded-full dark:bg-primary-900 dark:text-primary-300">
              {{ index + 1 }}
            </div>
            
            <!-- Article Content -->
            <div class="flex-1 min-w-0">
              <h2 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <a :href="item.link" target="_blank" class="block">
                  {{ item.title }}
                </a>
              </h2>
              
              <!-- Article Meta -->
              <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div v-if="item.author" class="flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ item.author }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ formatDate(item.pubDate) }}</span>
                </div>
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"/>
                  </svg>
                  <a :href="item.link" target="_blank" class="hover:text-primary-600 dark:hover:text-primary-400">{{ getDomain(item.link) }}</a>
                </div>
                <div class="flex items-center space-x-1" :class="getCommentCount(item.link) > 0 ? 'text-primary-600 dark:text-primary-400' : ''">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                  </svg>
                  <span>{{ getCommentCount(item.link) }}</span>
                </div>
              </div>
              
              <!-- Article Description -->
              <p v-if="item.description" class="font-normal text-gray-700 dark:text-gray-400 line-clamp-2 mb-3" v-html="stripHtml(item.description)"></p>
              
              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-2">
                <button @click="viewArticle(item, index)" 
                        class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition-colors">
                  <svg class="w-3.5 h-3.5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  View Article
                </button>
                
                <a :href="item.link" target="_blank" 
                   class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 transition-colors">
                  <svg class="w-3.5 h-3.5 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  Original
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import { useFeedsStore } from '../stores/feeds.js'
import { useCommentsStore } from '../stores/comments.js'
import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'RssFeedList',
  props: {
    feedUrl: { type: String, required: true }
  },
  setup(props) {
    const feedsStore = useFeedsStore()
    const commentsStore = useCommentsStore()
    const router = useRouter()

    // Initialize comments store
    commentsStore.initialize()

    // Computed properties from stores
    const feed = computed(() => feedsStore.selectedFeedData || { title: '', description: '', items: [] })
    const loading = computed(() => feedsStore.isSelectedFeedLoading)
    const error = computed(() => feedsStore.selectedFeedError)

    // Set the selected feed when component mounts or feedUrl changes
    onMounted(() => {
      if (props.feedUrl) {
        feedsStore.setSelectedFeed(props.feedUrl)
      }
    })

    watch(() => props.feedUrl, (newFeedUrl) => {
      if (newFeedUrl) {
        feedsStore.setSelectedFeed(newFeedUrl)
      }
    })

    const formatDate = (date) => {
      const now = new Date()
      const diff = Math.floor((now - date) / 1000)
      
      if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
      if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
      if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`
      
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      }).format(date)
    }

    const getDomain = (url) => {
      try {
        return new URL(url).hostname.replace('www.', '')
      } catch {
        return 'unknown'
      }
    }

    const stripHtml = (html) => {
      return html ? html.replace(/<[^>]*>/g, '').substring(0, 150) : ''
    }

    const viewArticle = (article, index) => {
      // Create a unique ID for the article
      const articleId = `${Date.now()}-${index}`
      
      // Store article data in localStorage for the article view
      localStorage.setItem(`article-${articleId}`, JSON.stringify(article))
      
      // Navigate to article view
      router.push({
        name: 'Article',
        params: { 
          id: articleId,
          article: article
        }
      })
    }

    const getCommentCount = (articleUrl) => {
      return commentsStore.getCommentCount(articleUrl)
    }

    return {
      feed,
      loading,
      error,
      formatDate,
      getDomain,
      stripHtml,
      viewArticle,
      getCommentCount
    }
  }
}
</script>

