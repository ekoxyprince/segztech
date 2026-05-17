/**
 * SegzTech Analytics Tracking Utility
 * Comprehensive user tracking with cookie-based sessions
 */

(function() {
  'use strict';

  const Analytics = {
    sessionId: null,
    userId: null,
    pageLoadTime: Date.now(),
    scrollTracked: false,
    timeTracked: false,
    isInitialized: false,
    consentGiven: false,
    trackingData: {},

    init: function() {
      if (this.isInitialized) return;
      this.isInitialized = true;
      
      // Get or create session ID from cookie
      this.sessionId = this.getCookie('segz_session') || this.generateSessionId();
      this.setCookie('segz_session', this.sessionId, 365);
      
      // Check consent status
      this.checkConsent();
      
      // Get user info if logged in
      this.getUserInfo();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Track initial page view if consent given
      if (this.consentGiven) {
        this.trackInitialPageView();
      }
      
      // Always start time tracker
      this.startTimeTracker();
      
      // Track browser details in cookie for analytics
      this.trackBrowserDetails();
    },

    generateSessionId: function() {
      return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9) + '_' + this.generateFingerprint();
    },

    generateFingerprint: function() {
      // Simple fingerprint based on browser properties
      const nav = navigator;
      const screen = window.screen;
      const fingerprint = [
        nav.userAgent,
        nav.language,
        nav.platform,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset()
      ].join('|');
      
      // Simple hash
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(36);
    },

    getCookie: function(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    },

    setCookie: function(name, value, days) {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
    },

    deleteCookie: function(name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    },

    checkConsent: function() {
      const consent = this.getCookie('segztech_cookies');
      if (!consent) {
        this.consentGiven = false;
        return false;
      }
      try {
        const prefs = JSON.parse(consent);
        this.consentGiven = prefs.analytics || prefs.personalization || false;
        
        // Store consent preferences
        if (this.consentGiven) {
          this.trackingData.consent = prefs;
        }
        return this.consentGiven;
      } catch (e) {
        this.consentGiven = false;
        return false;
      }
    },

    isTrackingEnabled: function() {
      return this.consentGiven;
    },

    getUserInfo: function() {
      // Try to get user ID from page data if available
      const userElement = document.querySelector('[data-user-id]');
      if (userElement) {
        this.userId = userElement.dataset.userId;
        this.setCookie('segz_user', this.userId, 365);
      } else {
        this.userId = this.getCookie('segz_user');
      }
    },

    setupEventListeners: function() {
      const self = this;
      
      // Track clicks on products, buttons, links
      $(document).on('click', '[data-track]', function(e) {
        self.trackClick($(this), e);
      });

      $(document).on('click', '.product-card, .product-item', function() {
        self.trackProductClick($(this));
      });

      $(document).on('click', '.add-to-cart-btn, .add-to-cart-btn-large, [data-add-to-cart]', function() {
        self.trackAddToCart($(this));
      });

      $(document).on('click', '.remove-from-cart, [data-remove-from-cart]', function() {
        self.trackRemoveFromCart($(this));
      });

      $(document).on('click', '.wishlist-btn, .wishlist-btn-large, [data-wishlist]', function() {
        self.trackWishlist($(this));
      });

      // Scroll tracking
      $(window).on('scroll', function() {
        self.trackScrollDepth();
      });

      // Exit tracking
      $(window).on('beforeunload', function() {
        self.trackExit();
      });

      // Page visibility
      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
          self.trackExit();
        }
      });
    },

    trackBrowserDetails: function() {
      const details = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages,
        platform: navigator.platform,
        screenWidth: screen.width,
        screenHeight: screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        colorDepth: screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency || null,
        deviceMemory: navigator.deviceMemory || null,
        connection: navigator.connection ? {
          effectiveType: navigator.connection.effectiveType,
          downlink: navigator.connection.downlink,
          rtt: navigator.connection.rtt
        } : null,
        touchSupport: 'ontouchstart' in window,
        timestamp: Date.now()
      };
      
      // Store in localStorage for persistence
      try {
        localStorage.setItem('segz_browser', JSON.stringify(details));
      } catch (e) {}
      
      // Send to server if consented
      if (this.isTrackingEnabled()) {
        this.send('/api/analytics/browser-details', details);
      }
    },

    trackInitialPageView: function() {
      const data = {
        type: 'page_view',
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        title: document.title,
        screenResolution: screen.width + 'x' + screen.height,
        viewportSize: window.innerWidth + 'x' + window.innerHeight,
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.send('/api/analytics/session', data);
    },

    trackPageView: function() {
      if (!this.isTrackingEnabled()) return;

      const data = {
        type: 'page_view',
        url: window.location.href,
        path: window.location.pathname,
        title: document.title,
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.send('/api/analytics/track', data);
    },

    trackProductView: function(productId, productName, price, category, brand) {
      if (!this.isTrackingEnabled()) return;

      const data = {
        type: 'product_view',
        productId: productId,
        productName: productName,
        price: price,
        category: category,
        brand: brand,
        url: window.location.href,
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.send('/api/analytics/track', data);
    },

    trackSearch: function(query, resultsCount, clickedProductId, aiEnhanced) {
      if (!this.isTrackingEnabled()) return;

      const data = {
        type: 'search',
        query: query,
        resultsCount: resultsCount,
        clickedProductId: clickedProductId || null,
        aiEnhanced: aiEnhanced || false,
        url: window.location.href,
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.send('/api/analytics/track', data);
    },

    trackClick: function($element, event) {
      if (!this.isTrackingEnabled()) return;

      const data = {
        type: 'click',
        element: $element[0].tagName.toLowerCase(),
        text: $element.text().trim().substring(0, 100),
        href: $element.attr('href') || '',
        trackId: $element.data('track'),
        className: $element.attr('class'),
        url: window.location.pathname,
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.send('/api/analytics/track', data);
    },

    trackProductClick: function($element) {
      if (!this.isTrackingEnabled()) return;

      const $card = $element.closest('.product-card, .product-item');
      if (!$card.length) return;

      const productId = $card.data('product-id') || $card.find('[data-product-id]').data('product-id');
      
      const data = {
        type: 'product_click',
        productId: productId,
        productName: $card.find('.product-name, .product-title, h3, .title').text().trim(),
        url: window.location.pathname,
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.send('/api/analytics/track', data);
    },

    trackAddToCart: function($element) {
      if (!this.isTrackingEnabled()) return;

      const productId = $element.data('product-id') || $element.closest('[data-product-id]').data('product-id');
      const $card = $element.closest('.product-card, .product-item');
      
      const data = {
        type: 'add_to_cart',
        productId: productId,
        productName: $card ? $card.find('.product-name, .product-title').text().trim() : 'Unknown',
        price: $card ? parseFloat($card.find('.current-price, .price').text().replace(/[^0-9.]/g, '')) || 0 : 0,
        url: window.location.pathname,
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.send('/api/analytics/track', data);
    },

    trackRemoveFromCart: function($element) {
      if (!this.isTrackingEnabled()) return;

      const productId = $element.data('product-id') || $element.closest('[data-product-id]').data('product-id');
      
      const data = {
        type: 'remove_from_cart',
        productId: productId,
        url: window.location.pathname,
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.send('/api/analytics/track', data);
    },

    trackWishlist: function($element) {
      if (!this.isTrackingEnabled()) return;

      const productId = $element.data('product-id') || $element.closest('[data-product-id]').data('product-id');
      const isAdding = !$element.hasClass('active');
      
      const data = {
        type: isAdding ? 'wishlist_add' : 'wishlist_remove',
        productId: productId,
        url: window.location.pathname,
        sessionId: this.sessionId,
        userId: this.userId
      };

      this.send('/api/analytics/track', data);
    },

    scrollMilestones: {25: false, 50: false, 75: false, 100: false},

    trackScrollDepth: function() {
      if (!this.isTrackingEnabled()) return;

      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      
      [25, 50, 75, 100].forEach(depth => {
        if (scrollPercent >= depth && !this.scrollMilestones[depth]) {
          this.scrollMilestones[depth] = true;
          this.send('/api/analytics/track', { 
            type: 'scroll_depth', 
            depth: depth,
            sessionId: this.sessionId,
            userId: this.userId,
            url: window.location.pathname
          });
        }
      });
      
      if (scrollPercent >= 100 && !this.scrollTracked) {
        this.scrollTracked = true;
      }
    },

    timeMilestones: {30: false, 60: false, 180: false, 300: false},

    trackTimeOnPage: function() {
      if (!this.isTrackingEnabled() || this.timeTracked) return;

      const timeSpent = Math.round((Date.now() - this.pageLoadTime) / 1000);
      
      [30, 60, 180, 300].forEach(seconds => {
        if (timeSpent >= seconds && !this.timeMilestones[seconds]) {
          this.timeMilestones[seconds] = true;
          this.send('/api/analytics/track', { 
            type: 'time_on_page', 
            seconds: seconds,
            sessionId: this.sessionId,
            userId: this.userId,
            url: window.location.pathname
          });
        }
      });
      
      if (timeSpent >= 300) {
        this.timeTracked = true;
      }
    },

    startTimeTracker: function() {
      const self = this;
      setInterval(function() {
        self.trackTimeOnPage();
      }, 10000);
    },

    trackExit: function() {
      const data = {
        type: 'exit',
        url: window.location.pathname,
        timeSpent: Math.round((Date.now() - this.pageLoadTime) / 1000),
        scrollDepth: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100),
        sessionId: this.sessionId,
        userId: this.userId
      };

      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/track', JSON.stringify(data));
      } else {
        this.send('/api/analytics/track', data);
      }
    },

    trackCheckout: function(step, data) {
      if (!this.isTrackingEnabled()) return;

      const trackingData = {
        type: 'checkout_' + step,
        url: window.location.pathname,
        sessionId: this.sessionId,
        userId: this.userId,
        ...data
      };

      this.send('/api/analytics/track', trackingData);
    },

    send: function(url, data) {
      try {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          keepalive: true
        }).catch(function() {});
      } catch (e) {}
    }
  };

  // Expose to global
  window.SegzAnalytics = Analytics;

  // Initialize when DOM is ready
  $(document).ready(function() {
    Analytics.init();
  });

  // Also try to initialize immediately in case jQuery is already ready
  if (document.readyState !== 'loading') {
    Analytics.init();
  }

})();
