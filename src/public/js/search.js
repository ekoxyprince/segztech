// Search JavaScript - Live Search with AJAX + AI Search

$(document).ready(function() {
  let searchTimeout;
  const searchInput = $('#searchInput');
  const searchResults = $('#searchResults');
  
  // Mobile search input
  const mobileSearchInput = $('#mobileSearchInput');
  const mobileSearchResults = $('#mobileSearchResults');
  
  // AI Search toggle
  const aiSearchBtn = $('#aiSearchBtn');
  const aiSearchResults = $('#aiSearchResults');
  let isAiMode = false;
  
  // AI Search button click
  aiSearchBtn?.on('click', function() {
    isAiMode = !isAiMode;
    $(this).toggleClass('active', isAiMode);
    searchInput.attr('placeholder', isAiMode ? 'Ask AI: e.g., "gaming laptop under $1000 with RTX 4060"' : 'Search products...');
    searchInput.focus();
  });
  
  // Live search - Desktop
  searchInput.on('input', function() {
    const query = $(this).val().trim();
    if (isAiMode && query.length >= 3) {
      performAiSearch(query, searchResults);
    } else {
      performSearch(query, searchResults);
    }
  });
  
  // Live search - Mobile
  mobileSearchInput.on('input', function() {
    const query = $(this).val().trim();
    performSearch(query, mobileSearchResults, true);
  });
  
  // AI Search function
  function performAiSearch(query, resultsContainer) {
    clearTimeout(searchTimeout);
    
    if (query.length < 3) {
      resultsContainer.removeClass('show').empty();
      return;
    }
    
    resultsContainer.html(`
      <div class="ai-search-loading">
        <div class="spinner"></div>
        <span>Analyzing your request...</span>
      </div>
    `).addClass('show');
    
    $.ajax({
      url: '/api/products/ai-search',
      method: 'GET',
      data: { q: query },
      success: function(response) {
        if (response.success && response.results) {
          let html = `
            <div class="ai-search-header">
              <i class="fas fa-robot"></i>
              <span>AI Search Results for "${query}"</span>
            </div>
          `;
          
          if (response.results.products && response.results.products.length > 0) {
            html += `<div class="ai-results-count">Found ${response.results.total} matching products</div>`;
            
            response.results.products.slice(0, 6).forEach(function(product) {
              const image = product.images && product.images[0] ? product.images[0].image_url : '/images/placeholder.jpg';
              html += `
                <a href="/products/${product.slug}" class="search-result-item">
                  <img src="${image}" alt="${product.name}">
                  <div class="result-info">
                    <span class="result-name">${product.name}</span>
                    <span class="result-price">₦${parseFloat(product.price).toFixed(2)}</span>
                    ${product.matchReason ? `<span class="match-reason">${product.matchReason}</span>` : ''}
                  </div>
                </a>
              `;
            });
            
            html += `
              <a href="/products?search=${encodeURIComponent(response.searchQuery)}" class="search-all ai-search-link">
                <i class="fas fa-external-link-alt"></i>
                View all ${response.results.total} results
              </a>
            `;
          } else {
            html += `
              <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No products match your requirements.</p>
                <small>Try adjusting your search terms.</small>
              </div>
            `;
          }
          
          resultsContainer.html(html).addClass('show');
        } else {
          performSearch(query, resultsContainer);
        }
      },
      error: function() {
        performSearch(query, resultsContainer);
      }
    });
  }
  
  // Shared search function
  function performSearch(query, resultsContainer, isMobile = false) {
    clearTimeout(searchTimeout);
    
    if (query.length < 2) {
      resultsContainer.removeClass('show').empty();
      return;
    }
    
    searchTimeout = setTimeout(function() {
      $.ajax({
        url: '/api/products/search',
        method: 'GET',
        data: { q: query },
        success: function(response) {
          if (response.products && response.products.length > 0) {
            let html = '';
            
            response.products.forEach(function(product) {
              const image = product.images && product.images[0] ? (product.images[0].image_url || product.images[0]) : '/images/placeholder.jpg';
              html += `
                <a href="/products/${product.slug}" class="search-result-item">
                  <img src="${image}" alt="${product.name}">
                  <div class="result-info">
                    <span class="result-name">${product.name}</span>
                    <span class="result-price">₦${parseFloat(product.price).toFixed(2)}</span>
                  </div>
                </a>
              `;
            });
            
            if (!isMobile) {
              html += `
                <a href="/products?search=${encodeURIComponent(query)}" class="search-all">
                  View all results for "${query}"
                </a>
              `;
            }
            
            resultsContainer.html(html).addClass('show');
          } else {
            resultsContainer.html(`
              <div class="no-results">
                <p>No products found for "${query}"</p>
              </div>
            `).addClass('show');
          }
        }
      });
    }, 300);
  }
  
  // Close search results when clicking outside - Desktop
  $(document).on('click', function(e) {
    if (!$(e.target).closest('.search-bar').length) {
      searchResults.removeClass('show');
    }
  });
  
  // Close search results when clicking outside - Mobile
  $(document).on('click', function(e) {
    if (!$(e.target).closest('#searchDrawer').length && !$(e.target).closest('#mobileSearchBtn').length) {
      mobileSearchResults.removeClass('show');
    }
  });
  
  // Navigate to search results on Enter - Desktop
  searchInput.on('keypress', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      const query = $(this).val().trim();
      if (query.length >= 2) {
        window.location.href = '/products?search=' + encodeURIComponent(query);
      }
    }
  });
  
  // Navigate to search results on Enter - Mobile
  mobileSearchInput.on('keypress', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      const query = $(this).val().trim();
      if (query.length >= 2) {
        window.location.href = '/products?search=' + encodeURIComponent(query);
      }
    }
  });
});
