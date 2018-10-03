# Detect Headless

Access <https://infosimples.github.io/detect-headless> to run several headless detection tests against your browser.

## Tests

- **User Agent:** in a browser running with `puppeteer` in headless mode, user agent includes `Headless`.

- **App Version:** same as User Agent above.

- **Plugins:** headless browsers don't have any plugins. So we can say that if it has plugin it's headful, but not otherwise since some browsers, like Firefox, don't have default plugins.

- **Plugins Prototype:** check if the `Plugin` and `PluginsArray` prototype are correct.

- **Mime Type:** similar to **Plugins** test, where headless browsers don't have any mime type

- **Mime Type Prototype:** check if the `MimeType` and `MimeTypeArray`prototype are correct.

- **Languages:** all headful browser has at least one language. So we can say that if it has no language it's headless.

- **Webdriver:** this property is true when running in a headless browser.

- **Time elapse:** it pops an `alert()` on page and if it's closed too fast, means that it's headless.

- **Chrome element:** it's specific for `chrome` browser that has an element `window.chrome`.

- **Permission:** in headless mode `Notification.permission` and `navigator.permissions.query` report contradictory values.

- **Devtool:** `puppeteer` works on `devtools protocol`, this test checks if `devtool` is present or not.

- **Broken Image:** all browser has a default `nonzero` broken image size, and this may not happen on a headless browser.

- **Outer Dimension:** the attributes `outerHeight` and `outerWidth` have value 0 on headless browser.

- **Connection Rtt:** The attribute `navigator.connection.rtt`,if present, has value 0 on headless browser.

- **Mouse Move:** The attributes `movementX` and `movementY` on every `MouseEvent` have value 0 on headless browser.
