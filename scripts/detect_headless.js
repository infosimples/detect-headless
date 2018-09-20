/* This is a generic function that verify if the browswer is headless or not
 * @param name (string): name of the test (same as the id name for the row corresponding)
 *                         to the test in HTML)
 * @param testFunction (function): funtion that checks if the browser si headless or not
 * @param resultFunction (function): function that assigns to the result block in HTML
 *                                   the reason why the browser is headless or not
 *
 * OBS: the test function return 1 if it's headless, 0 if it's normal, or -1 if it's undefined
 */
async function testBrowser(name, testFunction) {
  const row = document.getElementById(name);
  const resultBlock = document.getElementById(`${name}-result`);
  result = await testFunction(resultBlock);
  if (result == 1)
    row.classList.add('headless');
  else if (result == 0)
    row.classList.add('normal');
  else
    row.classList.add('undefined');
}

// Test for user agent
function testUserAgent(resultBlock) {
  let agent = navigator.userAgent
  userAgentWriteResult(resultBlock, agent);
  return /Headless/.test(agent);
}

function userAgentWriteResult(resultBlock, agent) {
  resultBlock.innerHTML = agent;
}

// Test for plugins
function testPlugins(resultBlock) {
  let length = navigator.plugins.length
  pluginsWriteResult(resultBlock, length);
  return length === 0 ? '-1' : '0';
}

function pluginsWriteResult(resultBlock, length) {
  resultBlock.innerHTML = `Detected ${length} plugins`;
}

// Test for languages
function testLanguages(resultBlock) {
  let language = navigator.language;
  let languagesLength = navigator.languages.length;
  languagesWriteResult(resultBlock, language, languagesLength)
  if (!language || languagesLength === 0)
    return 1;
  return -1;
}

function languagesWriteResult(resultBlock, language, languagesLength) {
  resultBlock.innerHTML = `Detected ${languagesLength} languages and using ${language}`;
}

// Test for webdriver (headless browser has this flag true)
function testWebdriver(resultBlock) {
  let webdriver = navigator.webdriver;
  webdriverWriteResult(resultBlock, webdriver)
  return webdriver ? 1: 0;
}

function webdriverWriteResult(resultBlock, webdriver) {
  if (webdriver)
    resultBlock.innerHTML = `Webdriver present`
  else
    resultBlock.innerHTML = `Missing webdriver`
}

// Test for time elapsed after alert()
function testTimeElapse(resultBlock) {
  let start = Date.now();
  alert('Press OK');
  let elapse = Date.now() - start;
  timeElapseWriteResult(resultBlock, elapse);
  return elapse < 30;
}

function timeElapseWriteResult(resultBlock, elapse) {
  let signal = elapse < 30 ? '<': '>';
  resultBlock.innerHTML = `Time elapsed: ${elapse} (${signal} 30)`;
}

// Test for chrome element (especific for google chrome browser)
function testChrome(resultBlock) {
  let chrome = window.chrome;
  chromeWriteResult(resultBlock, chrome);
  return chrome ? 0 : -1
}

function chromeWriteResult(resultBlock, chrome) {
  if (chrome)
    resultBlock.innerHTML = `Chrome element present`;
  else
    resultBlock.innerHTML = `Chrome element not present`;
}

// Test for permission
async function testPermission(resultBlock) {
  if (!navigator.permissions) {
    resultBlock.innerHTML = `Object navigator.permissions is undefined`
    return -1
  }
  let permissionStatus = await navigator.permissions.query({ name: 'notifications' });
  let notificationPermission = Notification.permission;
  permissionWriteResult(resultBlock, permissionStatus, notificationPermission);
  if (notificationPermission === 'denied' && permissionStatus.state === 'prompt')
    return 1;
  return 0;
}

function permissionWriteResult(resultBlock, permissionStatus, notificationPermission) {
  resultBlock.innerHTML = `Permission stauts is "${permissionStatus.state}" and notification
                           permission is "${notificationPermission}"`
}

// Test for devtools protocol
function testDevtool(resultBlock) {
  const any = /./;
  let count = 0;
  let oldToString = any.toString;

  any.toString = function() {
    count++;
    return 'any';
  }

  console.debug(any);
  let usingDevTools = count > 1;
  devtoolWriteResult(resultBlock, usingDevTools);
  any.toString = oldToString;
  return usingDevTools ? -1 : 0;
}

function devtoolWriteResult(resultBlock, usingDevTools) {
  if (usingDevTools)
    resultBlock.innerHTML = 'Using devtools protocol';
  else
    resultBlock.innerHTML = 'Not using devtools protocol'
}

// Test for broken image
function testImage(resultBlock) {
  var body = document.getElementById("image-result");
  var image = document.createElement("img");
  image.src = "fake_image.png";
  body.appendChild(image);
  image.onerror = function(){
    imageWriteResult(resultBlock, image.width, image.height);
    if(image.width === 0 && image.height === 0)
      return 1;
    return -1;
  }
}

function imageWriteResult(resultBlock, width, height) {
  resultBlock.innerHTML = `Broken image has width ${width} and height ${height}`;
}

/*
 *  Here is where we execute all the tests specified above
 */
const tests = [
  { name: 'user-agent',     testFunction: testUserAgent  },
  { name: 'plugins',        testFunction: testPlugins    },
  { name: 'languages',      testFunction: testLanguages  },
  { name: 'webdriver',      testFunction: testWebdriver  },
  { name: 'time-elapse',    testFunction: testTimeElapse },
  { name: 'chrome-element', testFunction: testChrome     },
  { name: 'permission',     testFunction: testPermission },
  { name: 'devtool',        testFunction: testDevtool    },
  { name: 'image',          testFunction: testImage      }
];

for (var i = 0; i < tests.length ; i++) {
  testBrowser(tests[i].name, tests[i].testFunction, tests[i].resultFunction);
}
