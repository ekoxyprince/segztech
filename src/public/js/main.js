// Main JavaScript - SegzTech Premium

$(document).ready(function() {
  // Hero Slider
  initHeroSlider();
  
  // Flash Sale Countdown
  initCountdown();
  
  // Newsletter Form
  initNewsletter();
  
  // Scroll Effects
  initScrollEffects();
  
  // Animate on Scroll
  initAnimateOnScroll();
  
  // Drawer System
  initDrawers();
});

// Hero Slider
function initHeroSlider() {
  var slides = $('.slide');
  var dots = $('.dot');
  var currentSlide = 0;
  var autoSlide;
  
  if (!slides.length) return;
  
  function showSlide(index) {
    slides.removeClass('active');
    dots.removeClass('active');
    slides.eq(index).addClass('active');
    dots.eq(index).addClass('active');
    currentSlide = index;
  }
  
  function nextSlide() {
    var next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }
  
  function prevSlide() {
    var prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }
  
  function startAutoSlide() {
    autoSlide = setInterval(nextSlide, 5000);
  }
  
  function stopAutoSlide() {
    clearInterval(autoSlide);
  }
  
  $('.slider-next').click(function() {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });
  
  $('.slider-prev').click(function() {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });
  
  dots.click(function() {
    stopAutoSlide();
    showSlide($(this).data('index'));
    startAutoSlide();
  });
  
  startAutoSlide();
  $('.hero-slider').hover(stopAutoSlide, startAutoSlide);
}

// Countdown Timer
function initCountdown() {
  var hoursEl = $('#hours');
  var minutesEl = $('#minutes');
  var secondsEl = $('#seconds');
  
  if (!hoursEl.length) return;
  
  var totalSeconds = 23 * 3600 + 59 * 60 + 59;
  
  function updateCountdown() {
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    
    hoursEl.text(hours.toString().padStart(2, '0'));
    minutesEl.text(minutes.toString().padStart(2, '0'));
    secondsEl.text(seconds.toString().padStart(2, '0'));
    
    if (totalSeconds > 0) {
      totalSeconds--;
    } else {
      totalSeconds = 23 * 3600 + 59 * 60 + 59;
    }
  }
  
  setInterval(updateCountdown, 1000);
}

// Newsletter Form
function initNewsletter() {
  $('#newsletterForm').submit(function(e) {
    e.preventDefault();
    var email = $(this).find('input[type="email"]').val();
    alert('Thank you for subscribing! You will receive updates at ' + email);
    this.reset();
  });
}

// Scroll Effects
function initScrollEffects() {
  $(window).scroll(function() {
    if ($(this).scrollTop() > 50) {
      $('.header').addClass('scrolled');
    } else {
      $('.header').removeClass('scrolled');
    }
  });
}

// Animate on Scroll
function initAnimateOnScroll() {
  var elements = document.querySelectorAll('.product-card, .category-card, .promo-banner, .feature-card');
  
  for (var i = 0; i < elements.length; i++) {
    var el = elements[i];
    var rect = el.getBoundingClientRect();
    
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      continue;
    }
    
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  }
  
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });
  
  for (var i = 0; i < elements.length; i++) {
    var rect = elements[i].getBoundingClientRect();
    if (rect.top >= window.innerHeight) {
      observer.observe(elements[i]);
    }
  }
}

// Drawer System
function initDrawers() {
  // Menu Drawer
  var menuToggleBtn = $('#hamburgerBtn');
  var menuCloseBtn = $('#menuCloseBtn');
  var menuDrawer = $('#menuDrawer');
  var menuOverlay = $('#menuOverlay');
  
  function openMenu() {
    menuDrawer.addClass('active');
    menuOverlay.addClass('active');
    $('body').css('overflow', 'hidden');
  }
  
  function closeMenu() {
    menuDrawer.removeClass('active');
    menuOverlay.removeClass('active');
    $('body').css('overflow', '');
  }
  
  if (menuToggleBtn.length) {
    menuToggleBtn.on('click', openMenu);
    menuCloseBtn.on('click', closeMenu);
    menuOverlay.on('click', closeMenu);
  }
  
  // Cart Drawer
  var cartToggleBtn = $('#cartDrawerBtn');
  var cartCloseBtn = $('#cartCloseBtn');
  var cartDrawer = $('#cartDrawer');
  var cartOverlay = $('#cartOverlay');
  
  function openCart() {
    cartDrawer.addClass('active');
    cartOverlay.addClass('active');
    $('body').css('overflow', 'hidden');
    loadCartDrawer();
  }
  
  function closeCart() {
    cartDrawer.removeClass('active');
    cartOverlay.removeClass('active');
    $('body').css('overflow', '');
  }
  
  if (cartToggleBtn.length) {
    cartToggleBtn.on('click', openCart);
    cartCloseBtn.on('click', closeCart);
    cartOverlay.on('click', closeCart);
  }
  
  // Filter Drawer
  var filterToggleBtn = $('#filterToggleBtn');
  var filterCloseBtn = $('#filterCloseBtn');
  var filterDrawer = $('#filterDrawer');
  var filterOverlay = $('#filterOverlay');
  
  function openFilter() {
    filterDrawer.addClass('active');
    filterOverlay.addClass('active');
    $('body').css('overflow', 'hidden');
  }
  
  function closeFilter() {
    filterDrawer.removeClass('active');
    filterOverlay.removeClass('active');
    $('body').css('overflow', '');
  }
  
  if (filterToggleBtn.length) {
    filterToggleBtn.on('click', openFilter);
    filterCloseBtn.on('click', closeFilter);
    filterOverlay.on('click', closeFilter);
  }
  
  // Mobile Search Drawer
  var searchToggleBtn = $('#mobileSearchBtn');
  var searchCloseBtn = $('#searchCloseBtn');
  var searchDrawer = $('#searchDrawer');
  var searchOverlay = $('#searchOverlay');
  
  function openSearch() {
    searchDrawer.addClass('active');
    searchOverlay.addClass('active');
    $('body').css('overflow', 'hidden');
    setTimeout(function() {
      searchDrawer.find('input').first().focus();
    }, 300);
  }
  
  function closeSearch() {
    searchDrawer.removeClass('active');
    searchOverlay.removeClass('active');
    $('body').css('overflow', '');
  }
  
  if (searchToggleBtn.length) {
    searchToggleBtn.on('click', openSearch);
    searchCloseBtn.on('click', closeSearch);
    searchOverlay.on('click', closeSearch);
  }
  
  // Close all drawers on escape
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMenu();
      closeCart();
      closeFilter();
      closeSearch();
    }
  });
  
  // Close drawers on resize to desktop
  $(window).on('resize', function() {
    if ($(this).width() > 768) {
      closeMenu();
      closeFilter();
      closeSearch();
    }
  });
}

// Load Cart Drawer Content via AJAX
function loadCartDrawer() {
  var body = $('#cartDrawerBody');
  var footer = $('#cartDrawerFooter');
  
  // Show skeleton loader
  body.html('<div class="cart-drawer-loading">' +
    '<div class="skeleton-card"><div class="skeleton-image"></div><div class="skeleton-content"><div class="skeleton-line title"></div><div class="skeleton-line medium"></div><div class="skeleton-line price"></div></div></div>' +
    '<div class="skeleton-card"><div class="skeleton-image"></div><div class="skeleton-content"><div class="skeleton-line title"></div><div class="skeleton-line medium"></div><div class="skeleton-line price"></div></div></div>' +
    '</div>');
  
  $.ajax({
    url: '/api/cart',
    method: 'GET',
    success: function(response) {
      if (response.cart && response.cart.length > 0) {
        var html = '<div class="cart-drawer-items">';
        response.cart.forEach(function(item) {
          html += '<div class="cart-drawer-item" data-product-id="' + item.productId + '">' +
            '<div class="cart-drawer-item-image"><img src="' + item.image + '" alt="' + item.name + '"></div>' +
            '<div class="cart-drawer-item-info">' +
              '<div class="cart-drawer-item-name">' + item.name + '</div>' +
              '<div class="cart-drawer-item-price">₦' + item.price.toFixed(2) + '</div>' +
              '<div class="cart-drawer-item-qty">Qty: ' + item.quantity + '</div>' +
            '</div>' +
            '<button class="cart-drawer-item-remove" onclick="removeCartDrawerItem(\'' + item.productId + '\')"><i class="fas fa-times"></i></button>' +
          '</div>';
        });
        html += '</div>';
        body.html(html);
        $('#cartDrawerTotal').text('₦' + response.totals.subtotal.toFixed(2));
        footer.show();
      } else {
        body.html('<div class="cart-drawer-empty">' +
          '<i class="fas fa-shopping-cart"></i>' +
          '<h4>Your cart is empty</h4>' +
          '<p>Start adding some products!</p>' +
          '<a href="/products" class="btn btn-primary btn-sm">Browse Products</a>' +
          '</div>');
        footer.hide();
      }
    },
    error: function() {
      body.html('<div class="cart-drawer-empty"><p>Failed to load cart</p></div>');
      footer.hide();
    }
  });
}

// Remove item from cart drawer
function removeCartDrawerItem(productId) {
  $.ajax({
    url: '/api/cart/' + productId,
    method: 'DELETE',
    success: function(response) {
      if (response.success) {
        updateCartCount(response.cartCount);
        loadCartDrawer();
        showNotification('Item removed from cart', 'success');
      }
    }
  });
}

// Utility Functions
function formatPrice(price) {
  return '₦' + parseFloat(price).toFixed(2);
}

function showNotification(message, type) {
  type = type || 'success';
  var notification = $('<div class="notification ' + type + '">' + message + '</div>');
  $('body').append(notification);
  
  setTimeout(function() { notification.addClass('show'); }, 10);
  setTimeout(function() {
    notification.removeClass('show');
    setTimeout(function() { notification.remove(); }, 300);
  }, 3000);
}

function updateCartCount(count) {
  var cartBadge = $('.cart-badge');
  if (count > 0) {
    if (cartBadge.length) {
      cartBadge.text(count);
    } else {
      $('.cart-action, .cart-drawer-btn').append('<span class="badge cart-badge">' + count + '</span>');
    }
  } else {
    cartBadge.remove();
  }
}

function updateWishlistCount(count) {
  var wishlistBadge = $('.wishlist-badge');
  if (count > 0) {
    if (wishlistBadge.length) {
      wishlistBadge.text(count);
    } else {
      $('.header-action:has(.fa-heart)').append('<span class="badge wishlist-badge">' + count + '</span>');
    }
  } else {
    wishlistBadge.remove();
  }
}
