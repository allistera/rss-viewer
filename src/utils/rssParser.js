export async function fetchRssFeed(url) {
  try {
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (data.status === 'ok') {
      return {
        title: data.feed.title,
        description: data.feed.description,
        items: data.items.map(item => ({
          title: item.title,
          link: item.link,
          description: item.description,
          pubDate: new Date(item.pubDate),
          author: item.author
        }))
      };
    } else {
      throw new Error('Failed to fetch RSS feed');
    }
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    throw error;
  }
}