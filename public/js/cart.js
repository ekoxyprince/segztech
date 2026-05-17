/**
 * SegzTech Cart Functionality
 */

$(document).ready(function() {
  initCartDrawer();
  initCartActions();
});

function initCartDrawer() {
  const $cartDrawerBtn = $('#cartDrawerBtn');
  const $cartOverlay = $('#cartOverlay');
  const $cartDrawer = $('#cartDrawer');
  const $cartCloseBtn = $('#cartCloseBtn');

  if ($cartDrawerBtn.length) {
    $cartDrawerBtn.on('click', function() {
      openCartDrawer();
    });
  }

  if ($cartOverlay.length) {
    $cartOverlay.on('click', function() {
      closeCartDrawer();
    });
  }

  if ($cartCloseBtn.length) {
    $cartCloseBtn.on('click', function() {
      closeCartDrawer();
    });
  }
}

function openCartDrawer() {
  $('#cartOverlay').addClass('active');
  $('#cartDrawer').addClass('active');
  $('body').css('overflow', 'hidden');
  loadCartDrawer();
}

function closeCartDrawer() {
  $('#cartOverlay').removeClass('active');
  $('#cartDrawer').removeClass('active');
  $('body').css('overflow', '');
}

function loadCartDrawer() {
  const $body = $('#cartDrawerBody');
  $body.html(`
    <div class="cart-drawer-loading">
      <div class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line price"></div>
        </div>
      </div>
      <div class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line price"></div>
        </div>
      </div>
    </div>
  `);

  $.ajax({
    url: '/api/cart',
    method: 'GET',
    success: function(response) {
      if (response.cart && response.cart.length > 0) {
        renderCartItems(response.cart, response.totals);
      } else {
        renderEmptyCart();
      }
    },
    error: function() {
      $body.html('<div class="cart-empty"><p>Failed to load cart</p></div>');
    }
  });
}

function renderCartItems(items, totals) {
  const $body = $('#cartDrawerBody');
  
  let html = '<div class="cart-items-list">';
  
  items.forEach(item => {
    const image = item.product && item.product.images && item.product.images[0]
      ? (item.product.images[0].image_url || item.product.images[0])
      : '/images/placeholder.jpg';
    
    const price = typeof item.product.price === 'string'
      ? parseFloat(item.product.price).toFixed(2)
      : item.product.price.toFixed(2);
    
    html += `
      <div class="cart-item" data-product-id="${item.productId}">
        <img src="${image}" alt="${item.product.name}">
        <div class="cart-item-info">
          <h4>${item.product.name}</h4>
          <span class="cart-item-price">₦${price}</span>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateCartQty('${item.productId}', -1)">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="updateCartQty('${item.productId}', 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.productId}')">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });
  
  html += '</div>';
  
  $body.html(html);
  
  const subtotal = totals.subtotal.toFixed(2);
  $('#cartDrawerTotal').text('₦' + subtotal);
}

function renderEmptyCart() {
  const $body = $('#cartDrawerBody');
  $body.html(`
    <div class="cart-empty">
      <i class="fas fa-shopping-cart"></i>
      <p>Your cart is empty</p>
      <a href="/products" class="btn btn-primary btn-sm">Start Shopping</a>
    </div>
  `);
  $('#cartDrawerTotal').text('₦0.00');
}

function initCartActions() {
  $(document).on('click', '[data-add-to-cart]', function() {
    const productId = $(this).data('product-id');
    const quantity = $(this).data('quantity') || 1;
    addToCart(productId, quantity);
  });

  $(document).on('click', '.add-to-cart-btn, .add-to-cart-btn-large', function() {
    const productId = $(this).data('product-id');
    if (productId) {
      addToCart(productId, 1);
    }
  });
}

function addToCart(productId, quantity = 1) {
  $.ajax({
    url: '/api/cart/add',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ productId, quantity }),
    success: function(response) {
      if (response.success) {
        updateCartCount(response.cartCount);
        showNotification('Added to cart!', 'success');
        
        if (window.SegzAnalytics) {
          SegzAnalytics.trackAddToCart({ productId });
        }
        
        openCartDrawer();
      } else {
        showNotification(response.message || 'Failed to add to cart', 'error');
      }
    },
    error: function() {
      showNotification('An error occurred', 'error');
    }
  });
}

function updateCartQty(productId, change) {
  $.ajax({
    url: '/api/cart/update',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ productId, quantity: change, isDelta: true }),
    success: function(response) {
      if (response.success) {
        updateCartCount(response.cartCount);
        loadCartDrawer();
      } else {
        showNotification(response.message || 'Failed to update', 'error');
      }
    },
    error: function() {
      showNotification('An error occurred', 'error');
    }
  });
}

function removeFromCart(productId) {
  $.ajax({
    url: '/api/cart/' + productId,
    method: 'DELETE',
    success: function(response) {
      if (response.success) {
        updateCartCount(response.cartCount);
        
        if (window.SegzAnalytics) {
          SegzAnalytics.trackRemoveFromCart({ productId });
        }
        
        loadCartDrawer();
      } else {
        showNotification('Failed to remove item', 'error');
      }
    },
    error: function() {
      showNotification('An error occurred', 'error');
    }
  });
}

function updateCartCount(count) {
  const $badges = $('.cart-badge');
  if (count > 0) {
    $badges.text(count).show();
  } else {
    $badges.hide();
  }
}

function showNotification(message, type) {
  const $notification = $('<div class="notification ' + type + '">' + message + '</div>');
  $('body').append($notification);
  
  setTimeout(() => {
    $notification.addClass('show');
  }, 10);
  
  setTimeout(() => {
    $notification.removeClass('show');
    setTimeout(() => {
      $notification.remove();
    }, 300);
  }, 3000);
}

window.addToCart = addToCart;
window.updateCartQty = updateCartQty;
window.removeFromCart = removeFromCart;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.loadCartDrawer = loadCartDrawer;
