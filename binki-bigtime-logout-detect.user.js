// ==UserScript==
// @name binki-bigtime-logout-detect
// @version  1.0.0
// @homepageURL https://github.com/binki/binki-bigtime-logout-detect
// @match https://intuit.bigtime.net/bigtime
// @match https://intuit.bigtime.net/bigtime/*
// @match https://intuit.bigtime.net/Bigtime
// @match https://intuit.bigtime.net/Bigtime/*
// ==/UserScript==

(async () => {
  // I tried using jQuery via unsafeWindow, but that had errors. For
  // this, we need to hook into the jQuery that the site itself is
  // using since that lets us intercept AJAX requests/responses. So
  // manually-injected script tag it is!
  const script = document.createElement('script');
  script.textContent = `
  jQuery(document).on('ajaxComplete', (event, xhr, settings) => {
    // When logged out, the AJAX calls are expecting JSON or a specifically formatted HTML
    // but they instead get a generalized HTML error. Detect this error and refresh the page.
    if (xhr.status === 200 && xhr.statusText === 'parsererror') {
      location.reload();
    }
  });
  `;
  document.head.append(script);
})();
