/**
 * LG Site Cleanup Transformer
 * Removes non-content elements from the LG.com DOM before block parsing.
 * Handles: navigation, footer, cookie banners, chat widgets, tracking scripts.
 */
export default function transform(hookName, element) {
  if (hookName === 'beforeTransform') {
    // Remove site navigation and header
    const selectorsToRemove = [
      '.lg-header',
      '.lg-navigation',
      '.lg-nav',
      '#header',
      'header',
      'nav',
      // Footer
      '.lg-footer',
      '#footer',
      'footer',
      // Cookie/consent banners
      '.cookie-banner',
      '.consent-banner',
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      // Chat widgets
      '.chat-widget',
      '#livechat-compact-container',
      '.lg-chatbot',
      // Social share overlays
      '.social-share-overlay',
      '.share-modal',
      // Promotional popups
      '.popup-modal',
      '.newsletter-popup',
      // Tracking/analytics
      'noscript',
      // Article navigation (prev/next article links)
      '.lg-article-nav',
      '.lg-article-related',
      // Breadcrumb (handled via metadata)
      '.breadcrumb',
      '.lg-breadcrumb',
    ];

    selectorsToRemove.forEach((selector) => {
      element.querySelectorAll(selector).forEach((el) => el.remove());
    });

    // Remove inline scripts and styles
    element.querySelectorAll('script, style').forEach((el) => el.remove());

    // Remove hidden elements
    element.querySelectorAll('[style*="display: none"], [style*="display:none"], [hidden]').forEach((el) => el.remove());
  }

  if (hookName === 'afterTransform') {
    // Clean up empty divs left after element removal
    element.querySelectorAll('div:empty').forEach((el) => {
      if (!el.classList.length && !el.id) {
        el.remove();
      }
    });
  }
}
