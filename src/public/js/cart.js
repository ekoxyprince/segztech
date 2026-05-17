// Cart JavaScript - AJAX Cart Functions

$(document).ready(function() {
  // Add to Cart button click (product cards)
  $(document).on('click', '.add-to-cart-btn', function(e) {
    e.preventDefault();
    var btn = $(this);
    var productId = btn.data('product-id');
    
    btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Adding...');
    
    $.ajax({
      url: '/api/cart/add',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ productId: productId, quantity: 1 }),
      success: function(response) {
        if (response.success) {
          updateCartCount(response.cartCount);
          showNotification('Product added to cart!', 'success');
          btn.prop('disabled', false).html('<i class="fas fa-shopping-cart"></i> <span>Add to Cart</span>');
        } else {
          showNotification(response.message || 'Failed to add to cart', 'error');
          btn.prop('disabled', false).html('<i class="fas fa-shopping-cart"></i> <span>Add to Cart</span>');
        }
      },
      error: function() {
        showNotification('An error occurred. Please try again.', 'error');
        btn.prop('disabled', false).html('<i class="fas fa-shopping-cart"></i> <span>Add to Cart</span>');
      }
    });
  });
  
  // Add to cart from product detail page
  $(document).on('click', '#addToCartBtn, #addToCartBtnMobile', function(e) {
    e.preventDefault();
    var btn = $(this);
    var productId = btn.data('product-id');
    var quantity = parseInt($('#productQuantity').val()) || 1;
    
    btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Adding...');
    
    $.ajax({
      url: '/api/cart/add',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ productId: productId, quantity: quantity }),
      success: function(response) {
        if (response.success) {
          updateCartCount(response.cartCount);
          showNotification('Product added to cart!', 'success');
          btn.prop('disabled', false).html('<i class="fas fa-shopping-cart"></i> Add to Cart');
        } else {
          showNotification(response.message || 'Failed to add to cart', 'error');
          btn.prop('disabled', false).html('<i class="fas fa-shopping-cart"></i> Add to Cart');
        }
      },
      error: function() {
        showNotification('An error occurred. Please try again.', 'error');
        btn.prop('disabled', false).html('<i class="fas fa-shopping-cart"></i> Add to Cart');
      }
    });
  });
  
  // Update cart item quantity
  $(document).on('change', '.cart-item .quantity-selector input', function() {
    var input = $(this);
    var productId = input.closest('.cart-item').data('product-id');
    var quantity = parseInt(input.val());
    
    if (quantity <= 0) {
      input.val(1);
      return;
    }
    
    $.ajax({
      url: '/api/cart/update',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ productId: productId, quantity: quantity }),
      success: function(response) {
        if (response.success) {
          updateCartTotals(response.totals);
          updateCartCount(response.cartCount);
        }
      }
    });
  });
  
  // Remove from cart
  $(document).on('click', '.cart-item-remove', function() {
    var btn = $(this);
    var productId = btn.closest('.cart-item').data('product-id');
    
    if (confirm('Are you sure you want to remove this item?')) {
      $.ajax({
        url: '/api/cart/' + productId,
        method: 'DELETE',
        success: function(response) {
          if (response.success) {
            btn.closest('.cart-item').slideUp(300, function() {
              $(this).remove();
              if ($('.cart-item').length === 0) {
                location.reload();
              }
            });
            updateCartTotals(response.totals);
            updateCartCount(response.cartCount);
            showNotification('Item removed from cart', 'success');
          }
        }
      });
    }
  });
});

function updateCartTotals(totals) {
  $('.summary-row span:last').first().text(formatPrice(totals.subtotal));
  $('.summary-total span:last').text(formatPrice(totals.total));
}
