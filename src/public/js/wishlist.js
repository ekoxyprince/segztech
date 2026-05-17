// Wishlist JavaScript - AJAX Wishlist Functions

$(document).ready(function() {
  // Toggle wishlist from product cards
  $(document).on('click', '.wishlist-btn', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    var btn = $(this);
    var productId = btn.data('product-id');
    var icon = btn.find('i');
    
    $.ajax({
      url: '/api/wishlist/toggle',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ productId: productId }),
      success: function(response) {
        if (response.success) {
          if (response.isInWishlist) {
            icon.removeClass('far').addClass('fas');
            btn.addClass('active');
            showNotification('Added to wishlist!', 'success');
          } else {
            icon.removeClass('fas').addClass('far');
            btn.removeClass('active');
            showNotification('Removed from wishlist', 'success');
          }
          updateWishlistCount(response.wishlistCount);
        } else {
          showNotification(response.message || 'Failed to update wishlist', 'error');
        }
      },
      error: function() {
        showNotification('Please login to add items to wishlist', 'error');
      }
    });
  });
  
  // Wishlist button on product detail page
  $(document).on('click', '#wishlistBtn, #wishlistBtnMobile', function(e) {
    e.preventDefault();
    
    var btn = $(this);
    var productId = btn.data('product-id');
    var icon = btn.find('i');
    
    $.ajax({
      url: '/api/wishlist/toggle',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ productId: productId }),
      success: function(response) {
        if (response.success) {
          if (response.isInWishlist) {
            icon.removeClass('far').addClass('fas');
            btn.addClass('active');
            showNotification('Added to wishlist!', 'success');
          } else {
            icon.removeClass('fas').addClass('far');
            btn.removeClass('active');
            showNotification('Removed from wishlist', 'success');
          }
          updateWishlistCount(response.wishlistCount);
        }
      },
      error: function() {
        showNotification('Please login to add items to wishlist', 'error');
      }
    });
  });
  
  // Remove from wishlist page
  $(document).on('click', '.wishlist-card .remove-btn', function() {
    var btn = $(this);
    var productId = btn.closest('.wishlist-card').data('product-id');
    
    $.ajax({
      url: '/wishlist/remove',
      method: 'POST',
      data: { productId: productId },
      success: function(response) {
        if (response.success) {
          btn.closest('.wishlist-card').fadeOut(300, function() {
            $(this).remove();
            updateWishlistCount(response.wishlistCount);
            if ($('.wishlist-card').length === 0) {
              location.reload();
            }
          });
        }
      }
    });
  });
  
  // Move to cart from wishlist
  $(document).on('click', '.wishlist-card .add-to-cart-btn', function() {
    var btn = $(this);
    var productId = btn.closest('.wishlist-card').data('product-id');
    
    $.ajax({
      url: '/wishlist/move-to-cart',
      method: 'POST',
      data: { productId: productId },
      success: function(response) {
        if (response.success) {
          btn.closest('.wishlist-card').fadeOut(300, function() {
            $(this).remove();
            updateWishlistCount(response.wishlistCount);
            updateCartCount(response.cartCount);
            if ($('.wishlist-card').length === 0) {
              location.reload();
            }
          });
          showNotification('Item moved to cart!', 'success');
        } else {
          showNotification(response.message, 'error');
        }
      }
    });
  });
  
  // Move all to cart
  $(document).on('click', '.move-all-to-cart-btn', function() {
    if (confirm('Move all items to cart?')) {
      $.ajax({
        url: '/wishlist/move-to-cart',
        method: 'POST',
        success: function(response) {
          if (response.success) {
            location.reload();
            showNotification(response.addedCount + ' items moved to cart!', 'success');
          }
        }
      });
    }
  });
  
  // Clear wishlist
  $(document).on('click', '.clear-wishlist-btn', function() {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      $.ajax({
        url: '/wishlist/clear',
        method: 'POST',
        success: function() {
          location.reload();
        }
      });
    }
  });
});
