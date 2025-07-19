// Search indexing and filtering utilities

export const indexingHelper = {
  // Create search index for tests
  createTestIndex: (tests) => {
    return tests.map(test => ({
      ...test,
      searchText: [
        test.title,
        test.description,
        test.category?.name,
        test.difficulty,
        ...(test.test_tabs?.map(tab => tab.name) || [])
      ].join(' ').toLowerCase()
    }));
  },

  // Search tests
  searchTests: (tests, query) => {
    if (!query.trim()) return tests;
    
    const searchTerm = query.toLowerCase();
    return tests.filter(test => 
      test.searchText?.includes(searchTerm) ||
      test.title.toLowerCase().includes(searchTerm) ||
      test.description.toLowerCase().includes(searchTerm)
    );
  },

  // Filter tests by category
  filterByCategory: (tests, category) => {
    if (!category || category === 'all') return tests;
    return tests.filter(test => 
      test.category?.name.toLowerCase() === category.toLowerCase()
    );
  },

  // Filter tests by difficulty
  filterByDifficulty: (tests, difficulty) => {
    if (!difficulty || difficulty === 'all') return tests;
    return tests.filter(test => test.difficulty === difficulty);
  },

  // Filter tests by price
  filterByPrice: (tests, priceFilter) => {
    switch (priceFilter) {
      case 'free':
        return tests.filter(test => test.is_free);
      case 'paid':
        return tests.filter(test => !test.is_free);
      default:
        return tests;
    }
  },

  // Sort tests
  sortTests: (tests, sortBy) => {
    const sortedTests = [...tests];
    
    switch (sortBy) {
      case 'newest':
        return sortedTests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest':
        return sortedTests.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'popular':
        return sortedTests.sort((a, b) => (b.participants_count || 0) - (a.participants_count || 0));
      case 'rating':
        return sortedTests.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'price-low':
        return sortedTests.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return sortedTests.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'alphabetical':
        return sortedTests.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sortedTests;
    }
  },

  // Advanced filtering
  advancedFilter: (tests, filters) => {
    let filteredTests = [...tests];

    // Apply search
    if (filters.search) {
      filteredTests = indexingHelper.searchTests(filteredTests, filters.search);
    }

    // Apply category filter
    if (filters.category) {
      filteredTests = indexingHelper.filterByCategory(filteredTests, filters.category);
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      filteredTests = indexingHelper.filterByDifficulty(filteredTests, filters.difficulty);
    }

    // Apply price filter
    if (filters.price) {
      filteredTests = indexingHelper.filterByPrice(filteredTests, filters.price);
    }

    // Apply duration filter
    if (filters.duration) {
      filteredTests = filteredTests.filter(test => {
        switch (filters.duration) {
          case 'short': return test.duration <= 60;
          case 'medium': return test.duration > 60 && test.duration <= 120;
          case 'long': return test.duration > 120;
          default: return true;
        }
      });
    }

    // Apply question count filter
    if (filters.questionCount) {
      filteredTests = filteredTests.filter(test => {
        switch (filters.questionCount) {
          case 'small': return test.total_questions <= 30;
          case 'medium': return test.total_questions > 30 && test.total_questions <= 60;
          case 'large': return test.total_questions > 60;
          default: return true;
        }
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      filteredTests = indexingHelper.sortTests(filteredTests, filters.sortBy);
    }

    return filteredTests;
  },

  // Create faceted search results
  createFacets: (tests) => {
    const facets = {
      categories: {},
      difficulties: {},
      durations: {},
      prices: { free: 0, paid: 0 }
    };

    tests.forEach(test => {
      // Category facets
      const category = test.category?.name || 'Other';
      facets.categories[category] = (facets.categories[category] || 0) + 1;

      // Difficulty facets
      facets.difficulties[test.difficulty] = (facets.difficulties[test.difficulty] || 0) + 1;

      // Duration facets
      const durationCategory = test.duration <= 60 ? 'short' : 
                              test.duration <= 120 ? 'medium' : 'long';
      facets.durations[durationCategory] = (facets.durations[durationCategory] || 0) + 1;

      // Price facets
      if (test.is_free) {
        facets.prices.free++;
      } else {
        facets.prices.paid++;
      }
    });

    return facets;
  },

  // Highlight search terms
  highlightSearchTerms: (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  },

  // Get search suggestions
  getSearchSuggestions: (tests, query) => {
    if (!query.trim()) return [];
    
    const suggestions = new Set();
    const searchTerm = query.toLowerCase();
    
    tests.forEach(test => {
      // Add title suggestions
      if (test.title.toLowerCase().includes(searchTerm)) {
        suggestions.add(test.title);
      }
      
      // Add category suggestions
      if (test.category?.name.toLowerCase().includes(searchTerm)) {
        suggestions.add(test.category.name);
      }
      
      // Add tab suggestions
      test.test_tabs?.forEach(tab => {
        if (tab.name.toLowerCase().includes(searchTerm)) {
          suggestions.add(tab.name);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }
};

export default indexingHelper;