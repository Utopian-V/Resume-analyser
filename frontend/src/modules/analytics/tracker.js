/**
 * Analytics Tracker
 * Handled by: Analytics Team
 * Responsibilities: User behavior tracking, event monitoring
 */

const API_BASE_URL = process.env.REACT_API_URL;

class AnalyticsTracker {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getUserId() {
    // Get user ID from localStorage or generate anonymous ID
    return localStorage.getItem('userId') || 'anonymous_' + Math.random().toString(36).substr(2, 9);
  }

  async trackEvent(eventType, data = {}) {
    try {
      const eventData = {
        event_type: eventType,
        user_id: this.userId,
        session_id: this.sessionId,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        ...data
      };

      // Send to backend
      await fetch(`${API_BASE_URL}/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      });

      // Also track in Google Analytics if available
      if (window.gtag) {
        window.gtag('event', eventType, {
          event_category: data.category || 'general',
          event_label: data.label || '',
          value: data.value || 1
        });
      }

    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }

  // Page view tracking
  trackPageView(pageName, additionalData = {}) {
    this.trackEvent('page_view', {
      category: 'navigation',
      page_name: pageName,
      ...additionalData
    });
  }

  // Blog interaction tracking
  trackBlogView(blogId, blogTitle) {
    this.trackEvent('blog_view', {
      category: 'content',
      blog_id: blogId,
      blog_title: blogTitle
    });
  }

  trackBlogShare(blogId, platform) {
    this.trackEvent('blog_share', {
      category: 'social',
      blog_id: blogId,
      platform: platform
    });
  }

  // User interaction tracking
  trackButtonClick(buttonName, pageName) {
    this.trackEvent('button_click', {
      category: 'interaction',
      button_name: buttonName,
      page_name: pageName
    });
  }

  trackFormSubmission(formName, success) {
    this.trackEvent('form_submission', {
      category: 'interaction',
      form_name: formName,
      success: success
    });
  }

  // Feature usage tracking
  trackFeatureUsage(featureName, action) {
    this.trackEvent('feature_usage', {
      category: 'features',
      feature_name: featureName,
      action: action
    });
  }

  // Error tracking
  trackError(errorType, errorMessage, pageName) {
    this.trackEvent('error', {
      category: 'errors',
      error_type: errorType,
      error_message: errorMessage,
      page_name: pageName
    });
  }

  // Performance tracking
  trackPerformance(metric, value) {
    this.trackEvent('performance', {
      category: 'performance',
      metric: metric,
      value: value
    });
  }
}

// Global analytics instance
const analytics = new AnalyticsTracker();

export default analytics; 