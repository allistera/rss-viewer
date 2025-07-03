<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Modern Flowbite Navigation -->
    <nav class="bg-white border-gray-200 dark:bg-gray-900 border-b dark:border-gray-700 sticky top-0 z-50 shadow-sm">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <!-- Logo and Brand -->
        <div class="flex items-center space-x-3 rtl:space-x-reverse">
          <div class="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg dark:bg-primary-900">
            <svg class="w-6 h-6 text-primary-600 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
          </div>
          <div>
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">RSS Reader</span>
            <p class="text-sm text-gray-500 dark:text-gray-400">Modern news aggregator</p>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center space-x-3">
          <!-- Feed Selector -->
          <div class="relative">
            <select v-model="selectedFeed" 
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 min-w-48">
              <option value="">Choose a feed</option>
              <option v-for="feed in feeds" :key="feed.url" :value="feed.url">
                {{ feed.name }}
              </option>
            </select>
          </div>

          <!-- Enhanced Dark Mode Toggle with Better Visual Feedback -->
          <button @click="toggleTheme" 
                  type="button" 
                  :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
                 class="
  relative inline-flex items-center justify-center w-11 h-11 bg-gray-300 text-gray-800 rounded-lg border border-gray-300 transition duration-300 hover:bg-gray-400 focus:outline-none :class="[
                    'relative inline-flex items-center justify-center w-11 h-11 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 active:scale-95',
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-yellow-400 hover:bg-gray-700 hover:border-gray-500 focus:ring-yellow-300' 
                      : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 focus:ring-blue-300'
                  ]">
            <!-- Moon Icon for Light Mode -->
            <svg v-if="!isDarkMode" class="w-6 h-6 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 116.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
            <!-- Sun Icon for Dark Mode -->
            <svg v-else class="w-6 h-6 transition-transform duration-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
            </svg>
            <!-- Theme indicator badge -->
            <span class="sr-only">{{ isDarkMode ? 'Switch to light mode' : 'Switch to dark mode' }}</span>
            
            <!-- Visual feedback indicator -->
            <div v-if="isDarkMode" class="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-screen-xl mx-auto px-4 py-6">
      <router-view :selected-feed="selectedFeed" />
    </main>
  </div>
</template>

<script>
import { useFeedsStore } from './stores/feeds.js'
import { computed, ref, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const feedsStore = useFeedsStore()
    const isDarkMode = ref(false)
    
    const feeds = computed(() => feedsStore.availableFeeds)
    const selectedFeed = computed({
      get: () => feedsStore.selectedFeedUrl,
      set: (value) => feedsStore.setSelectedFeed(value)
    })

    onMounted(() => {
      initTheme()
    })

    const initTheme = () => {
      const savedTheme = localStorage.getItem('color-theme')
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      
      if (savedTheme) {
        isDarkMode.value = savedTheme === 'dark'
      } else {
        isDarkMode.value = prefersDark
      }
      
      document.documentElement.classList.toggle('dark', isDarkMode.value)
    }

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value
      document.documentElement.classList.toggle('dark', isDarkMode.value)
      localStorage.setItem('color-theme', isDarkMode.value ? 'dark' : 'light')
    }

    return {
      feeds,
      selectedFeed,
      isDarkMode,
      toggleTheme
    }
  }
}
</script>

