import { defineStore } from 'pinia'
import { fetchRssFeed } from '../utils/rssParser.js'

export const useFeedsStore = defineStore('feeds', {
  state: () => ({
    // Available RSS feeds
    availableFeeds: [
      { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
      { name: 'BBC News', url: 'http://feeds.bbci.co.uk/news/technology/rss.xml' },
      { name: 'Hacker News', url: 'https://hnrss.org/frontpage' },
      { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
      { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' }
    ],
    
    // Currently selected feed URL
    selectedFeedUrl: '',
    
    // Cached feed data
    feedCache: new Map(),
    
    // Loading states per feed
    loadingStates: new Map(),
    
    // Error states per feed
    errorStates: new Map(),
    
    // Last fetch timestamps
    lastFetchTimes: new Map()
  }),

  getters: {
    // Get the currently selected feed object
    selectedFeed: (state) => {
      return state.availableFeeds.find(feed => feed.url === state.selectedFeedUrl)
    },

    // Get cached feed data for the selected feed
    selectedFeedData: (state) => {
      return state.feedCache.get(state.selectedFeedUrl)
    },

    // Check if the selected feed is loading
    isSelectedFeedLoading: (state) => {
      return state.loadingStates.get(state.selectedFeedUrl) || false
    },

    // Get error for the selected feed
    selectedFeedError: (state) => {
      return state.errorStates.get(state.selectedFeedUrl) || null
    },

    // Check if feed data needs refresh (older than 5 minutes)
    needsRefresh: (state) => (feedUrl) => {
      const lastFetch = state.lastFetchTimes.get(feedUrl)
      if (!lastFetch) return true
      
      const fiveMinutes = 5 * 60 * 1000
      return Date.now() - lastFetch > fiveMinutes
    },

    // Get all feeds with their loading/error states
    feedsWithStatus: (state) => {
      return state.availableFeeds.map(feed => ({
        ...feed,
        isLoading: state.loadingStates.get(feed.url) || false,
        error: state.errorStates.get(feed.url) || null,
        hasData: state.feedCache.has(feed.url),
        lastFetch: state.lastFetchTimes.get(feed.url)
      }))
    }
  },

  actions: {
    // Set the selected feed
    setSelectedFeed(feedUrl) {
      this.selectedFeedUrl = feedUrl
      
      // Auto-load the feed if not cached or needs refresh
      if (feedUrl && (!this.feedCache.has(feedUrl) || this.needsRefresh(feedUrl))) {
        this.loadFeed(feedUrl)
      }
    },

    // Load RSS feed data
    async loadFeed(feedUrl = this.selectedFeedUrl) {
      if (!feedUrl) return

      // Set loading state
      this.loadingStates.set(feedUrl, true)
      this.errorStates.delete(feedUrl)

      try {
        const feedData = await fetchRssFeed(feedUrl)
        
        // Cache the feed data
        this.feedCache.set(feedUrl, feedData)
        this.lastFetchTimes.set(feedUrl, Date.now())
        
        return feedData
      } catch (error) {
        // Store error state
        this.errorStates.set(feedUrl, error.message)
        throw error
      } finally {
        // Clear loading state
        this.loadingStates.set(feedUrl, false)
      }
    },

    // Refresh the current feed
    async refreshSelectedFeed() {
      if (this.selectedFeedUrl) {
        // Force refresh by removing from cache
        this.feedCache.delete(this.selectedFeedUrl)
        this.lastFetchTimes.delete(this.selectedFeedUrl)
        
        return await this.loadFeed(this.selectedFeedUrl)
      }
    },

    // Clear feed cache
    clearCache(feedUrl = null) {
      if (feedUrl) {
        this.feedCache.delete(feedUrl)
        this.lastFetchTimes.delete(feedUrl)
        this.errorStates.delete(feedUrl)
      } else {
        this.feedCache.clear()
        this.lastFetchTimes.clear()
        this.errorStates.clear()
      }
    },

    // Add a new feed to available feeds
    addFeed(feedData) {
      if (!this.availableFeeds.find(feed => feed.url === feedData.url)) {
        this.availableFeeds.push(feedData)
      }
    },

    // Remove a feed from available feeds
    removeFeed(feedUrl) {
      const index = this.availableFeeds.findIndex(feed => feed.url === feedUrl)
      if (index > -1) {
        this.availableFeeds.splice(index, 1)
        this.clearCache(feedUrl)
        
        // If this was the selected feed, clear selection
        if (this.selectedFeedUrl === feedUrl) {
          this.selectedFeedUrl = ''
        }
      }
    },

    // Get feed statistics
    getFeedStats() {
      return {
        totalFeeds: this.availableFeeds.length,
        cachedFeeds: this.feedCache.size,
        loadingFeeds: Array.from(this.loadingStates.values()).filter(Boolean).length,
        errorFeeds: this.errorStates.size
      }
    }
  }
})