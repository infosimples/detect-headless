const HEADLESS  = 1;
const HEADFUL   = 0;
const UNDEFINED = -1;

/* This is a generic function that verify if the browswer is headless or not
 * @param name (string): name of the test (same as the id name for the row corresponding)
 *                         to the test in HTML)
 * @param testFunction (function): function that checks if the browser is headless or not
 *
 * OBS: the test function return 1 if it's headless, 0 if it's normal, or -1 if it's undefined
 *      and every test function calls a write result function to assign a brief description
 *      of the result
 */
async function testBrowser(name, testFunction) {
  const row         = document.getElementById(name);
  const resultBlock = document.getElementById(`${name}-result`);

  result = await testFunction(resultBlock);
  if (result == HEADLESS)
    row.classList.add("headless");
  else if (result == HEADFUL)
    row.classList.add("normal");
  else
    row.classList.add("undefined");
}

// Test for user agent
function testUserAgent(resultBlock) {
  let agent = navigator.userAgent;

  userAgentWriteResult(resultBlock, agent);
  return /headless/i.test(agent);
}

function userAgentWriteResult(resultBlock, agent) {
  resultBlock.innerHTML = agent;
}

// Test for plugins
function testPlugins(resultBlock) {
  let length = navigator.plugins.length;

  pluginsWriteResult(resultBlock, length);
  return length === 0 ? UNDEFINED : HEADFUL;
}

function pluginsWriteResult(resultBlock, length) {
  resultBlock.innerHTML = `Detected ${length} plugins`;
}

// Test for languages
function testLanguages(resultBlock) {
  let language        = navigator.language;
  let languagesLength = navigator.languages.length;

  languagesWriteResult(resultBlock, language, languagesLength);
  if (!language || languagesLength === 0)
    return HEADLESS;
  return UNDEFINED;
}

function languagesWriteResult(resultBlock, language, languagesLength) {
  resultBlock.innerHTML = `Detected ${languagesLength} languages and using ${language}`;
}

// Test for webdriver (headless browser has this flag true)
function testWebdriver(resultBlock) {
  let webdriver = navigator.webdriver;

  webdriverWriteResult(resultBlock, webdriver);
  return webdriver ? HEADLESS : HEADFUL;
}

function webdriverWriteResult(resultBlock, webdriver) {
  if (webdriver)
    resultBlock.innerHTML = "Webdriver present";
  else
    resultBlock.innerHTML = "Missing webdriver";
}

// Test for time elapsed after alert(). If it's closed too fast (< 30ms), it means
// the browser is headless
function testTimeElapse(resultBlock) {
  let start = Date.now();

  alert("Press OK");

  let elapse = Date.now() - start;
  timeElapseWriteResult(resultBlock, elapse);
  return elapse < 30;
}

function timeElapseWriteResult(resultBlock, elapse) {
  let signal = elapse < 30 ? "<": ">";

  resultBlock.innerHTML = `Time elapsed to close alert: ${elapse} (${signal} 30)`;
}

// Test for chrome element (especific for google chrome browser)
function testChrome(resultBlock) {
  let chrome = window.chrome;

  chromeWriteResult(resultBlock, chrome);
  return chrome ? HEADFUL : UNDEFINED;
}

function chromeWriteResult(resultBlock, chrome) {
  if (chrome)
    resultBlock.innerHTML = "Chrome element present";
  else
    resultBlock.innerHTML = "Chrome element not present";
}

// Test for permission
async function testPermission(resultBlock) {
  let permissionStatus, notificationPermission;

  if (!navigator.permissions) {
    permissionWriteResult(resultBlock, permissionStatus, notificationPermission);
    return UNDEFINED;
  }
  permissionStatus       = await navigator.permissions.query({ name: "notifications" });
  notificationPermission = Notification.permission;
  permissionWriteResult(resultBlock, permissionStatus, notificationPermission);

  if (notificationPermission === "denied" && permissionStatus.state === "prompt")
    return HEADLESS;
  return HEADFUL;
}

function permissionWriteResult(resultBlock, permissionStatus, notificationPermission) {
  if (permissionStatus && notificationPermission) {
    resultBlock.innerHTML = `Permission stauts is "${permissionStatus.state}" and notification
                             permission is "${notificationPermission}"`;
  } else {
    resultBlock.innerHTML = `Object navigator.permissions is undefined`;
  }
}

// Test for devtools protocol
function testDevtool(resultBlock) {
  const any = /./;
  let count = 0;
  let oldToString = any.toString;

  any.toString = function() {
    count++;
    return "any";
  }

  console.debug(any);
  let usingDevTools = count > 1;
  devtoolWriteResult(resultBlock, usingDevTools);
  any.toString = oldToString;
  return usingDevTools ? UNDEFINED : HEADFUL;
}

function devtoolWriteResult(resultBlock, usingDevTools) {
  if (usingDevTools)
    resultBlock.innerHTML = "Using devtools protocol";
  else
    resultBlock.innerHTML = "Not using devtools protocol";
}

// Test for broken image
function testImage(resultBlock) {
  var body  = document.getElementById("image-result");
  var image = document.createElement("img");

  image.src = "fake_image.png";
  body.appendChild(image);

  image.onerror = function(){
    imageWriteResult(resultBlock, image.width, image.height);
    if(image.width === 0 && image.height === 0)
      return HEADLESS;
    return HEADFUL;
  }
}

function imageWriteResult(resultBlock, width, height) {
  resultBlock.innerHTML = `Broken image has width ${width} and height ${height}`;
}

/*
 *  Here is where we execute all the tests specified above
 */
const tests = [
  { name: "User Agent",       id: "user-agent",     testFunction: testUserAgent  },
  { name: "Plugins",          id: "plugins",        testFunction: testPlugins    },
  { name: "Languages",        id: "languages",      testFunction: testLanguages  },
  { name: "Webdriver",        id: "webdriver",      testFunction: testWebdriver  },
  { name: "Time Elapse",      id: "time-elapse",    testFunction: testTimeElapse },
  { name: "Chrome",           id: "chrome-element", testFunction: testChrome     },
  { name: "Permission",       id: "permission",     testFunction: testPermission },
  { name: "Devtool Protocol", id: "devtool",        testFunction: testDevtool    },
  { name: "Broken Image",     id: "image",          testFunction: testImage      }
];

tests.forEach(test => {
  generateTableRow(test.name, test.id);
  testBrowser(test.id, test.testFunction, test.resultFunction);
});

// Generate a row for each test
function generateTableRow(name, id) {
  let table = document.getElementsByTagName("table")[0];

  // Insert a test row and set its id
  let row = table.insertRow();
  row.id = id;

  // Insert the name and result cell to the row
  let nameBlock  = row.insertCell();
  let resultBlock = row.insertCell();
  nameBlock.innerHTML = name;
  resultBlock.id = `${id}-result`;
}
