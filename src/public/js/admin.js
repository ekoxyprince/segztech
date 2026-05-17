/**
 * SegzTech Admin Dashboard - JavaScript
 */

$(document).ready(function() {
  // Initialize sidebar toggle
  initSidebar();
  
  // Initialize modals
  initModals();
});

/**
 * Sidebar Toggle
 */
function initSidebar() {
  var $menuToggle = $('#menuToggle');
  var $sidebar = $('.admin-sidebar');
  var $overlay = $('#sidebarOverlay');
  var $sidebarClose = $('#sidebarClose');
  
  $menuToggle.on('click', function() {
    $sidebar.addClass('active');
    $overlay.addClass('active');
    $('body').css('overflow', 'hidden');
  });
  
  $sidebarClose.on('click', closeSidebar);
  $overlay.on('click', closeSidebar);
  
  function closeSidebar() {
    $sidebar.removeClass('active');
    $overlay.removeClass('active');
    $('body').css('overflow', '');
  }
  
  $(document).on('keyup', function(e) {
    if (e.key === 'Escape') {
      closeSidebar();
      $('.modal-overlay.active').removeClass('active');
      $('body').css('overflow', '');
    }
  });
}

/**
 * Modals
 */
function initModals() {
  $(document).on('click', '.modal-close, .close-modal', function() {
    $(this).closest('.modal-overlay').removeClass('active');
    $('body').css('overflow', '');
  });
  
  $(document).on('click', '.modal-overlay', function(e) {
    if (e.target === this) {
      $(this).removeClass('active');
      $('body').css('overflow', '');
    }
  });
}

/**
 * Toast Notifications
 */
function showToast(message, type) {
  type = type || 'success';
  
  var container = $('#toastContainer');
  if (container.length === 0) {
    container = $('<div id="toastContainer" class="toast-container"></div>');
    $('body').append(container);
  }
  
  var toast = $('<div class="toast toast-' + type + '"><i class="fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i><span>' + message + '</span></div>');
  container.append(toast);
  
  setTimeout(function() { toast.addClass('show'); }, 10);
  
  setTimeout(function() {
    toast.removeClass('show');
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

window.showToast = showToast;

/**
 * Format Currency
 */
function formatCurrency(amount) {
  return '₦' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

/**
 * Format Date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Debounce Function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
