// ==UserScript==
// @name binki-bigtime-logout-detect
// @version  1.0.1
// @homepageURL https://github.com/binki/binki-bigtime-logout-detect
// @match https://*.bigtime.net/bigtime
// @match https://*.bigtime.net/bigtime/*
// @match https://*.bigtime.net/Bigtime
// @match https://*.bigtime.net/Bigtime/*
// ==/UserScript==

(async () => {
  // We are forced to use wildcard @match above but we don’t want to match irrelevant subdomains.
  // The only subdomain which has a fixed alternative purpose that we know about so far is “www.bigtime.net”,
  // so test for that. See #2.
  if (/^[^:]+:\/\/www\./.test(document.URL)) return;
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
