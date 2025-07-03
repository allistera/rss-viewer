<template>
  <div>
    <RssFeedList v-if="selectedFeed" :feed-url="selectedFeed" :key="selectedFeed" />
    
    <!-- Welcome State with Flowbite Card -->
    <div v-else class="flex items-center justify-center min-h-96">
      <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 text-center">
        <div class="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-lg dark:bg-primary-900">
          <svg class="w-8 h-8 text-primary-600 dark:text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
          </svg>
        </div>
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome to RSS Reader</h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Stay updated with the latest news from your favorite sources. Select a feed from the dropdown above to get started.</p>
        <div class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 cursor-pointer">
          <svg class="w-4 h-4 me-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12l-2-2v6h4v-6l-2 2z"/>
            <path d="M10 2L8 4h4l-2-2z"/>
          </svg>
          Choose a feed above
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RssFeedList from './RssFeedList.vue'

export default {
  name: 'HomeView',
  components: { RssFeedList },
  props: {
    selectedFeed: {
      type: String,
      default: ''
    }
  }
}
</script>