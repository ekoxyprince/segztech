/**
 * SegzTech Search Functionality
 */

$(document).ready(function() {
  initSearch();
});

function initSearch() {
  const $searchInput = $('#searchInput');
  const $searchResults = $('#searchResults');
  const $searchForm = $('#searchForm');
  let searchTimeout;

  if ($searchInput.length) {
    $searchInput.on('input', function() {
      const query = $(this).val().trim();
      
      clearTimeout(searchTimeout);
      
      if (query.length < 2) {
        $searchResults.hide();
        return;
      }
      
      searchTimeout = setTimeout(() => {
        performSearch(query);
      }, 300);
    });

    $searchInput.on('focus', function() {
      const query = $(this).val().trim();
      if (query.length >= 2) {
        $searchResults.show();
      }
    });

    $(document).on('click', function(e) {
      if (!$(e.target).closest('.search-bar').length) {
        $searchResults.hide();
      }
    });

    $searchForm.on('submit', function(e) {
      const query = $searchInput.val().trim();
      if (query) {
        trackSearchSubmit(query);
      }
    });
  }
}

function performSearch(query) {
  const $searchResults = $('#searchResults');
  
  $.ajax({
    url: '/api/products/search',
    method: 'GET',
    data: { q: query, limit: 8 },
    beforeSend: function() {
      $searchResults.html('<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Searching...</div>');
      $searchResults.show();
    },
    success: function(response) {
      if (response && response.products && response.products.length > 0) {
        renderSearchResults(response.products, query);
      } else {
        $searchResults.html('<div class="search-no-results">No products found for "' + query + '"</div>');
      }
    },
    error: function() {
      $searchResults.html('<div class="search-no-results">Search error. Please try again.</div>');
    }
  });
}

function renderSearchResults(products, query) {
  const $searchResults = $('#searchResults');
  
  let html = products.map(product => {
    const image = product.images && product.images[0] 
      ? product.images[0].image_url || product.images[0]
      : '/images/placeholder.jpg';
    
    const price = typeof product.price === 'string' 
      ? parseFloat(product.price).toFixed(2) 
      : product.price.toFixed(2);
    
    const highlightedName = highlightQuery(product.name, query);
    
    return `
      <a href="/products/${product.slug}" class="search-result-item" data-product-id="${product.id}">
        <img src="${image}" alt="${product.name}">
        <div class="search-result-info">
          <span class="search-result-name">${highlightedName}</span>
          <span class="search-result-price">₦${price}</span>
        </div>
      </a>
    `;
  }).join('');
  
  html += '<a href="/products?search=' + encodeURIComponent(query) + '" class="search-view-all">View all results for "' + query + '" <i class="fas fa-arrow-right"></i></a>';
  
  $searchResults.html(html);
  $searchResults.show();

  $searchResults.find('.search-result-item').on('click', function() {
    const productId = $(this).data('product-id');
    trackSearchClick(query, productId);
  });
}

function highlightQuery(text, query) {
  if (!query) return text;
  const regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return text.replace(regex, '<strong>$1</strong>');
}

function trackSearchSubmit(query) {
  if (window.SegzAnalytics && window.SegzAnalytics.isTrackingEnabled()) {
    $.ajax({
      url: '/api/analytics/track',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        type: 'search',
        query: query,
        resultsCount: 0,
        clickedProductId: null,
        aiEnhanced: false
      })
    });
  }
}

function trackSearchClick(query, productId) {
  if (window.SegzAnalytics && window.SegzAnalytics.isTrackingEnabled()) {
    $.ajax({
      url: '/api/analytics/track',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        type: 'search',
        query: query,
        resultsCount: 0,
        clickedProductId: productId,
        aiEnhanced: false
      })
    });
  }
}

window.performSearch = performSearch;
