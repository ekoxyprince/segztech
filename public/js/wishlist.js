/**
 * SegzTech Wishlist Functionality
 */

$(document).ready(function() {
  initWishlistActions();
});

function initWishlistActions() {
  $(document).on('click', '.wishlist-btn, .wishlist-btn-large, [data-wishlist-toggle]', function() {
    const $btn = $(this);
    const productId = $btn.data('product-id');
    
    if (!productId) return;
    
    toggleWishlist(productId, $btn);
  });
}

function toggleWishlist(productId, $btn) {
  $.ajax({
    url: '/api/wishlist/toggle',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ productId }),
    success: function(response) {
      if (response.success) {
        if (response.isInWishlist) {
          $btn.addClass('active').find('i').removeClass('far').addClass('fas');
          showNotification('Added to wishlist!', 'success');
          
          if (window.SegzAnalytics) {
            SegzAnalytics.trackWishlistAdd(productId);
          }
        } else {
          $btn.removeClass('active').find('i').removeClass('fas').addClass('far');
          showNotification('Removed from wishlist', 'success');
          
          if (window.SegzAnalytics) {
            SegzAnalytics.trackWishlistRemove(productId);
          }
        }
        
        updateWishlistCount(response.wishlistCount);
      } else {
        showNotification(response.message || 'Failed to update wishlist', 'error');
      }
    },
    error: function() {
      showNotification('An error occurred', 'error');
    }
  });
}

function addToWishlist(productId) {
  $.ajax({
    url: '/api/wishlist/toggle',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ productId }),
    success: function(response) {
      if (response.success) {
        showNotification('Added to wishlist!', 'success');
        
        if (window.SegzAnalytics) {
          SegzAnalytics.trackWishlistAdd(productId);
        }
        
        updateWishlistCount(response.wishlistCount);
      }
    },
    error: function() {
      showNotification('An error occurred', 'error');
    }
  });
}

function removeFromWishlist(productId) {
  $.ajax({
    url: '/api/wishlist/toggle',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ productId }),
    success: function(response) {
      if (response.success) {
        $('[data-wishlist-product="' + productId + '"]').fadeOut();
        showNotification('Removed from wishlist', 'success');
        
        if (window.SegzAnalytics) {
          SegzAnalytics.trackWishlistRemove(productId);
        }
        
        updateWishlistCount(response.wishlistCount);
      }
    },
    error: function() {
      showNotification('An error occurred', 'error');
    }
  });
}

function updateWishlistCount(count) {
  const $badges = $('.wishlist-badge');
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

window.toggleWishlist = toggleWishlist;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
