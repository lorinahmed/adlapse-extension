// Background service worker
// Handles content fetching and API calls

// Content cache to avoid excessive API calls
const contentCache = {
  news: [],
  poem: [],
  language: []
};

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getContent') {
    getContent(request.contentType).then(content => {
      sendResponse({ content });
    });
    return true; // Keep message channel open for async response
  }
});

// Get content based on type
async function getContent(type) {
  switch (type) {
    case 'news':
      return await getNewsContent();
    case 'poem':
      return await getPoemContent();
    case 'language':
      return await getLanguageContent();
    default:
      return { type: 'loading' };
  }
}

// Fetch news content
async function getNewsContent() {
  try {
    // Use a free news API (no auth required for basic usage)
    // Alternative: Use RSS feeds from major news sites
    const response = await fetch('https://www.reddit.com/r/worldnews/top.json?limit=10');
    const data = await response.json();

    if (data.data && data.data.children && data.data.children.length > 0) {
      // Get a random post from top news
      const posts = data.data.children;
      const randomPost = posts[Math.floor(Math.random() * posts.length)].data;

      return {
        type: 'news',
        title: randomPost.title,
        description: randomPost.selftext.substring(0, 200) || 'Click to read more...',
        source: 'Reddit r/worldnews'
      };
    }
  } catch (error) {
    console.error('Error fetching news:', error);
  }

  // Fallback content
  return {
    type: 'news',
    title: 'Stay curious and keep learning!',
    description: 'Unable to fetch live news at the moment. Check your connection.',
    source: 'Prime Overlay'
  };
}

// Fetch poem content
async function getPoemContent() {
  try {
    // Use PoetryDB API - free and no auth required
    const response = await fetch('https://poetrydb.org/random/1');
    const data = await response.json();

    if (data && data.length > 0) {
      const poem = data[0];
      const lines = poem.lines.slice(0, 8).join('\n'); // First 8 lines

      return {
        type: 'poem',
        title: poem.title,
        author: poem.author,
        lines: lines + (poem.lines.length > 8 ? '\n...' : '')
      };
    }
  } catch (error) {
    console.error('Error fetching poem:', error);
  }

  // Fallback poem
  return {
    type: 'poem',
    title: 'The Road Not Taken',
    author: 'Robert Frost',
    lines: 'Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it bent in the undergrowth;'
  };
}

// Generate language learning content
async function getLanguageContent() {
  // For now, use a curated list of words
  // In the future, this could call a translation API
  const words = [
    {
      word: 'Serendipity',
      translation: 'Finding something good without looking for it',
      example: 'Meeting my best friend was pure serendipity.'
    },
    {
      word: 'Ephemeral',
      translation: 'Lasting for a very short time',
      example: 'The beauty of cherry blossoms is ephemeral.'
    },
    {
      word: 'Resilience',
      translation: 'The ability to recover quickly from difficulties',
      example: 'Her resilience helped her overcome many challenges.'
    },
    {
      word: 'Eloquent',
      translation: 'Fluent and persuasive in speaking or writing',
      example: 'The speaker gave an eloquent presentation.'
    },
    {
      word: 'Ubiquitous',
      translation: 'Present or appearing everywhere',
      example: 'Smartphones have become ubiquitous in modern life.'
    },
    {
      word: 'Meticulous',
      translation: 'Showing great attention to detail; very careful',
      example: 'She was meticulous in her research.'
    },
    {
      word: 'Paradigm',
      translation: 'A typical example or pattern of something',
      example: 'The discovery shifted the scientific paradigm.'
    },
    {
      word: 'Ambiguous',
      translation: 'Open to more than one interpretation; unclear',
      example: 'His answer was deliberately ambiguous.'
    }
  ];

  const randomWord = words[Math.floor(Math.random() * words.length)];

  return {
    type: 'language',
    ...randomWord
  };
}

// Initialize extension
console.log('AdLapse Extension: Background script loaded');
