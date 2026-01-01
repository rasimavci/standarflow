"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Clock, TrendingUp, ExternalLink, Calendar, Newspaper, FileText, BarChart3, Bitcoin, DollarSign, X, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";

interface Article {
  title: string;
  date: string;
  content?: string;
  text?: string;
  tickers?: string;
  symbol?: string;
  image: string;
  link: string;
  url?: string;
  author?: string;
  site: string;
  publishedDate?: string;
}

type FeedCategory = 'fmp-articles' | 'general' | 'press-releases' | 'stock' | 'crypto' | 'forex';

interface CategoryConfig {
  id: FeedCategory;
  name: string;
  icon: any;
  endpoint: string;
  color: string;
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'fmp-articles',
    name: 'FMP Articles',
    icon: Newspaper,
    endpoint: 'fmp-articles',
    color: 'blue'
  },
  {
    id: 'general',
    name: 'General News',
    icon: FileText,
    endpoint: 'news/general-latest',
    color: 'purple'
  },
  {
    id: 'press-releases',
    name: 'Press Releases',
    icon: FileText,
    endpoint: 'news/press-releases-latest',
    color: 'green'
  },
  {
    id: 'stock',
    name: 'Stock News',
    icon: BarChart3,
    endpoint: 'news/stock-latest',
    color: 'orange'
  },
  {
    id: 'crypto',
    name: 'Crypto News',
    icon: Bitcoin,
    endpoint: 'news/crypto-latest',
    color: 'yellow'
  },
  {
    id: 'forex',
    name: 'Forex News',
    icon: DollarSign,
    endpoint: 'news/forex-latest',
    color: 'pink'
  }
];

// Helper function to strip HTML tags and decode HTML entities
const stripHtml = (html: string): string => {
  if (!html) return '';
  
  // Create a temporary div element to parse HTML
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  
  // Get text content (strips all HTML tags)
  return tmp.textContent || tmp.innerText || '';
};

export default function FeedPage() {
  const [selectedCategory, setSelectedCategory] = useState<FeedCategory>('general');
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articleContent, setArticleContent] = useState<string>('');
  const [loadingArticle, setLoadingArticle] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const API_KEY = "0MnwxO7b6STq6VUUvxvOfnTTEQ4YZ4ID";
  const LIMIT = 20;

  const loadArticles = useCallback(async (pageNum: number, category: FeedCategory, searchSymbol?: string) => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    try {
      const categoryConfig = CATEGORIES.find(c => c.id === category);
      let endpoint = categoryConfig?.endpoint || 'fmp-articles';
      let url = '';

      // Use search endpoints if search is active and category supports it
      if (searchSymbol && ['press-releases', 'stock', 'crypto', 'forex'].includes(category)) {
        const searchEndpoints: Record<string, string> = {
          'press-releases': 'news/press-releases',
          'stock': 'news/stock',
          'crypto': 'news/crypto',
          'forex': 'news/forex'
        };
        endpoint = searchEndpoints[category];
        url = `https://financialmodelingprep.com/stable/${endpoint}?symbols=${encodeURIComponent(searchSymbol)}&apikey=${API_KEY}`;
      } else {
        url = `https://financialmodelingprep.com/stable/${endpoint}?page=${pageNum}&limit=${LIMIT}&apikey=${API_KEY}`;
      }
      
      const response = await fetch(url);

      // Handle specific error codes
      if (!response.ok) {
        if (response.status === 402) {
          setError('API limit reached. Please try again later or upgrade your API plan.');
        } else if (response.status === 429) {
          setError('Too many requests. Please wait a moment and try again.');
        } else if (response.status === 401 || response.status === 403) {
          setError('API authentication failed. Please check your API key.');
        } else {
          setError(`Unable to load articles (Error ${response.status}). Please try again later.`);
        }
        if (pageNum === 0) setArticles([]);
        setHasMore(false);
        return;
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        setError('Invalid response from server. Please try again later.');
        if (pageNum === 0) setArticles([]);
        setHasMore(false);
        return;
      }

      const data = await response.json();

      let articleList: Article[] = [];
      
      // Handle different API response structures
      if (data.content && Array.isArray(data.content)) {
        // FMP Articles format
        articleList = data.content.map((item: any) => ({
          ...item,
          content: stripHtml(item.content || ''),
          text: stripHtml(item.text || '')
        }));
      } else if (Array.isArray(data)) {
        // Direct array format (general, stock, crypto, forex, press-releases)
        articleList = data.map((item: any) => ({
          title: item.title,
          date: item.publishedDate || item.date,
          content: stripHtml(item.text || item.content || ''),
          text: stripHtml(item.text || ''),
          tickers: item.symbol || item.tickers,
          symbol: item.symbol,
          image: item.image,
          link: item.url || item.link,
          url: item.url,
          author: item.author,
          site: item.site || 'Financial News',
          publishedDate: item.publishedDate
        }));
      }

      if (articleList.length > 0) {
        setArticles(prev => pageNum === 0 ? articleList : [...prev, ...articleList]);
        // Disable pagination for search results
        setHasMore(searchSymbol ? false : articleList.length === LIMIT);
      } else {
        if (pageNum === 0) setArticles([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading articles:", error);
      setError('Failed to load articles. Please check your internet connection and try again.');
      if (pageNum === 0) setArticles([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    setArticles([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    setIsSearchMode(false);
    setSearchQuery('');
    loadArticles(0, selectedCategory);
  }, [selectedCategory, loadArticles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      // Reset to normal feed if search is empty
      setIsSearchMode(false);
      setArticles([]);
      setPage(0);
      setHasMore(true);
      setError(null);
      loadArticles(0, selectedCategory);
      return;
    }

    // Check if category supports search
    if (!['press-releases', 'stock', 'crypto', 'forex'].includes(selectedCategory)) {
      setError('Search is only available for Press Releases, Stock News, Crypto News, and Forex News categories.');
      return;
    }

    setIsSearchMode(true);
    setArticles([]);
    setPage(0);
    setError(null);
    loadArticles(0, selectedCategory, searchQuery.trim().toUpperCase());
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    setArticles([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    loadArticles(0, selectedCategory);
  };

  const lastArticleRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prevPage => {
            const nextPage = prevPage + 1;
            loadArticles(nextPage, selectedCategory);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadArticles, selectedCategory]
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchArticleContent = async (article: Article) => {
    setSelectedArticle(article);
    setLoadingArticle(false);
    
    // Use the content we already have from the API
    const content = article.content || article.text || '';
    
    setArticleContent(`
      <div class="space-y-4">
        ${article.image ? `<img src="${article.image}" alt="${article.title}" class="w-full rounded-lg mb-6" />` : ''}
        <div class="prose prose-lg dark:prose-invert max-w-none">
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${content}</p>
        </div>
        <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
            <strong>Note:</strong> This is a preview. Click "Read Full Article" below to view the complete article on the original site.
          </p>
        </div>
      </div>
    `);
  };

  const closeArticleModal = () => {
    setSelectedArticle(null);
    setArticleContent('');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Investment News Feed
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Stay updated with the latest financial news, market trends, and investment opportunities.
            </p>
          </div>

          {/* Category Selector */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex gap-3 pb-2 min-w-max">
              {CATEGORIES.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedCategory === category.id;
                const colorClasses = {
                  blue: isSelected ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700',
                  purple: isSelected ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700',
                  green: isSelected ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700',
                  orange: isSelected ? 'bg-orange-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700',
                  yellow: isSelected ? 'bg-yellow-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-yellow-50 dark:hover:bg-gray-700',
                  pink: isSelected ? 'bg-pink-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-700'
                };
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all shadow-md ${colorClasses[category.color as keyof typeof colorClasses]}`}
                  >
                    <Icon className="w-5 h-5" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    ['press-releases', 'stock', 'crypto', 'forex'].includes(selectedCategory)
                      ? selectedCategory === 'stock' || selectedCategory === 'press-releases'
                        ? 'Search by symbol (e.g., AAPL, TSLA)...'
                        : selectedCategory === 'crypto'
                        ? 'Search by symbol (e.g., BTCUSD, ETHUSD)...'
                        : 'Search by symbol (e.g., EURUSD, GBPUSD)...'
                      : 'Search not available for this category'
                  }
                  disabled={!['press-releases', 'stock', 'crypto', 'forex'].includes(selectedCategory)}
                  className="w-full px-6 py-4 pr-32 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  {isSearchMode && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!['press-releases', 'stock', 'crypto', 'forex'].includes(selectedCategory)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search
                  </button>
                </div>
              </div>
              {isSearchMode && (
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-semibold">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Showing results for: {searchQuery.toUpperCase()}
                  </span>
                </div>
              )}
            </form>
          </div>

          {/* Stats Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-12 text-white">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">{articles.length}</div>
                <div className="text-blue-100">Articles Loaded</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">
                  <TrendingUp className="w-8 h-8 mx-auto" />
                </div>
                <div className="text-blue-100">Live Updates</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">24/7</div>
                <div className="text-blue-100">Real-time News</div>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid gap-6">
            {articles.map((article, index) => {
              const isLastArticle = index === articles.length - 1;
              
              return (
                <div
                  key={`${article.link}-${index}`}
                  ref={isLastArticle ? lastArticleRef : null}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="md:flex">
                    {/* Image */}
                    {article.image && (
                      <div className="md:w-1/3">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-64 md:h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className={`p-6 ${article.image ? 'md:w-2/3' : 'w-full'}`}>
                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(article.date || article.publishedDate || '')}
                        </div>
                        {article.site && (
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                            {article.site}
                          </span>
                        )}
                        {(article.tickers || article.symbol) && (
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                            {article.tickers || article.symbol}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h2 
                        className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        onClick={() => fetchArticleContent(article)}
                      >
                        {article.title}
                      </h2>

                      {/* Content Preview */}
                      {(article.content || article.text) && (
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                          {article.content || article.text}
                        </p>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          {article.author && (
                            <span>By {article.author}</span>
                          )}
                        </div>
                        <button
                          onClick={() => fetchArticleContent(article)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                        >
                          Read More
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto px-8 py-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">Unable to Load Articles</h3>
                </div>
                <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setArticles([]);
                    setPage(0);
                    setHasMore(true);
                    loadArticles(0, selectedCategory);
                  }}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* End of Feed Message */}
          {!hasMore && articles.length > 0 && !error && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">You&apos;ve reached the end of the feed</span>
              </div>
            </div>
          )}

          {/* No Articles Message */}
          {!loading && articles.length === 0 && !error && (
            <div className="text-center py-12">
              <div className="inline-flex flex-col items-center gap-4 px-8 py-6 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <TrendingUp className="w-12 h-12 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No articles available at the moment
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={closeArticleModal}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-start justify-between z-10">
              <div className="flex-1 pr-4">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedArticle.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {selectedArticle.site && (
                    <span className="px-3 py-1 bg-white/20 text-white rounded-full font-semibold">
                      {selectedArticle.site}
                    </span>
                  )}
                  {(selectedArticle.tickers || selectedArticle.symbol) && (
                    <span className="px-3 py-1 bg-white/20 text-white rounded-full font-semibold">
                      {selectedArticle.tickers || selectedArticle.symbol}
                    </span>
                  )}
                  <span className="text-white/90">
                    {formatDate(selectedArticle.date || selectedArticle.publishedDate || '')}
                  </span>
                </div>
              </div>
              <button
                onClick={closeArticleModal}
                className="flex-shrink-0 p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: articleContent }}
              />
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-100 dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              {selectedArticle.author && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  By {selectedArticle.author}
                </span>
              )}
              <a
                href={selectedArticle.link || selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-semibold"
              >
                Read Full Article
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
