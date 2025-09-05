import { Order, DealerPerformance } from '../types';

// Fuzzy search utility functions
export class SearchEngine {
  // Levenshtein distance for fuzzy matching
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Calculate similarity score (0-1, where 1 is exact match)
  private static calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  // Normalize text for better matching
  private static normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[çÇ]/g, 'c')
      .replace(/[ğĞ]/g, 'g')
      .replace(/[ıİ]/g, 'i')
      .replace(/[öÖ]/g, 'o')
      .replace(/[şŞ]/g, 's')
      .replace(/[üÜ]/g, 'u')
      .trim();
  }

  // Extract searchable text from order
  private static extractOrderText(order: Order): string {
    const texts = [
      order.id,
      order.customerName,
      order.customerEmail,
      order.dealer,
      order.mainDealer,
      order.currentStage.name,
      order.currentStage.location,
      order.currentStage.responsibleParty,
      ...order.items.map(item => item.productName),
      ...order.items.map(item => item.currentStage.name),
      ...order.items.map(item => item.currentStage.location)
    ];
    
    return texts.join(' ').toLowerCase();
  }

  // Smart search with multiple strategies
  public static searchOrders(orders: Order[], query: string, options: {
    fuzzyThreshold?: number;
    maxResults?: number;
    sortByRelevance?: boolean;
  } = {}): Array<{ order: Order; score: number; matches: string[] }> {
    const {
      fuzzyThreshold = 0.6,
      maxResults = 50,
      sortByRelevance = true
    } = options;

    if (!query.trim()) return orders.map(order => ({ order, score: 1, matches: [] }));

    const normalizedQuery = this.normalizeText(query);
    const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0);
    
    const results = orders.map(order => {
      const orderText = this.normalizeText(this.extractOrderText(order));
      let totalScore = 0;
      const matches: string[] = [];

      // Exact match bonus
      if (orderText.includes(normalizedQuery)) {
        totalScore += 10;
        matches.push('Tam eşleşme');
      }

      // Term-based scoring
      queryTerms.forEach(term => {
        // Exact term match
        if (orderText.includes(term)) {
          totalScore += 5;
          matches.push(`"${term}" kelimesi`);
          return;
        }

        // Fuzzy matching for each field
        const fields = [
          { value: order.id, label: 'Sipariş ID' },
          { value: order.customerName, label: 'Müşteri Adı' },
          { value: order.customerEmail, label: 'E-posta' },
          { value: order.dealer, label: 'Bayi' },
          { value: order.mainDealer, label: 'Ana Bayi' },
          ...order.items.map(item => ({ value: item.productName, label: 'Ürün' }))
        ];

        fields.forEach(field => {
          const similarity = this.calculateSimilarity(term, this.normalizeText(field.value));
          if (similarity >= fuzzyThreshold) {
            totalScore += similarity * 3;
            matches.push(`${field.label}: "${field.value}"`);
          }
        });
      });

      // Boost score for recent orders
      const orderDate = new Date(order.orderDate);
      const daysSinceOrder = (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceOrder < 30) {
        totalScore += 2;
      }

      // Status priority boost
      if (order.status === 'in-progress') totalScore += 1;
      if (order.status === 'pending') totalScore += 0.5;

      return {
        order,
        score: totalScore,
        matches: [...new Set(matches)] // Remove duplicates
      };
    });

    // Filter results with minimum score
    const filteredResults = results.filter(result => result.score > 0);

    // Sort by relevance if requested
    if (sortByRelevance) {
      filteredResults.sort((a, b) => b.score - a.score);
    }

    // Limit results
    return filteredResults.slice(0, maxResults);
  }

  // Auto-complete suggestions
  public static getAutoCompleteSuggestions(orders: Order[], query: string, maxSuggestions = 10): string[] {
    if (!query.trim()) return [];

    const normalizedQuery = this.normalizeText(query);
    const suggestions = new Set<string>();

    orders.forEach(order => {
      // Collect all searchable terms
      const terms = [
        order.id,
        order.customerName,
        order.dealer,
        order.mainDealer,
        ...order.items.map(item => item.productName)
      ];

      terms.forEach(term => {
        const normalizedTerm = this.normalizeText(term);
        
        // Starts with query
        if (normalizedTerm.startsWith(normalizedQuery)) {
          suggestions.add(term);
        }
        
        // Contains query
        else if (normalizedTerm.includes(normalizedQuery) && normalizedQuery.length > 2) {
          suggestions.add(term);
        }
        
        // Fuzzy match for longer queries
        else if (normalizedQuery.length > 3) {
          const similarity = this.calculateSimilarity(normalizedQuery, normalizedTerm);
          if (similarity > 0.7) {
            suggestions.add(term);
          }
        }
      });
    });

    return Array.from(suggestions).slice(0, maxSuggestions);
  }

  // Search dealers with similar logic
  public static searchDealers(dealers: DealerPerformance[], query: string, options: {
    fuzzyThreshold?: number;
    maxResults?: number;
  } = {}): Array<{ dealer: DealerPerformance; score: number; matches: string[] }> {
    const { fuzzyThreshold = 0.6, maxResults = 20 } = options;

    if (!query.trim()) return dealers.map(dealer => ({ dealer, score: 1, matches: [] }));

    const normalizedQuery = this.normalizeText(query);
    const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0);

    const results = dealers.map(dealer => {
      let totalScore = 0;
      const matches: string[] = [];

      const searchableText = this.normalizeText([
        dealer.name,
        dealer.city,
        dealer.region,
        dealer.contactInfo.email,
        dealer.contactInfo.phone
      ].join(' '));

      // Exact match bonus
      if (searchableText.includes(normalizedQuery)) {
        totalScore += 10;
        matches.push('Tam eşleşme');
      }

      // Term-based scoring
      queryTerms.forEach(term => {
        const fields = [
          { value: dealer.name, label: 'Bayi Adı' },
          { value: dealer.city, label: 'Şehir' },
          { value: dealer.region, label: 'Bölge' }
        ];

        fields.forEach(field => {
          const similarity = this.calculateSimilarity(term, this.normalizeText(field.value));
          if (similarity >= fuzzyThreshold) {
            totalScore += similarity * 3;
            matches.push(`${field.label}: "${field.value}"`);
          }
        });
      });

      // Performance score boost
      totalScore += dealer.performanceScore / 100;

      return {
        dealer,
        score: totalScore,
        matches: [...new Set(matches)]
      };
    });

    return results
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }

  // Advanced filter combinations
  public static combineFilters(orders: Order[], filters: {
    query?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    dealer?: string;
    minAmount?: number;
    maxAmount?: number;
  }): Order[] {
    let results = [...orders];

    // Apply text search first
    if (filters.query) {
      const searchResults = this.searchOrders(results, filters.query);
      results = searchResults.map(r => r.order);
    }

    // Apply other filters
    if (filters.status) {
      results = results.filter(order => order.status === filters.status);
    }

    if (filters.dateFrom) {
      results = results.filter(order => 
        new Date(order.orderDate) >= new Date(filters.dateFrom!)
      );
    }

    if (filters.dateTo) {
      results = results.filter(order => 
        new Date(order.orderDate) <= new Date(filters.dateTo!)
      );
    }

    if (filters.dealer) {
      results = results.filter(order => 
        this.normalizeText(order.dealer).includes(this.normalizeText(filters.dealer!)) ||
        this.normalizeText(order.mainDealer).includes(this.normalizeText(filters.dealer!))
      );
    }

    return results;
  }
}

// Search history management
export class SearchHistory {
  private static readonly STORAGE_KEY = 'bellona_search_history';
  private static readonly MAX_HISTORY = 20;

  public static addToHistory(query: string): void {
    if (!query.trim()) return;

    const history = this.getHistory();
    const newHistory = [query, ...history.filter(h => h !== query)].slice(0, this.MAX_HISTORY);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newHistory));
  }

  public static getHistory(): string[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public static clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
