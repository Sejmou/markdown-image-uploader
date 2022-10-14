console.log('Content script running!');
console.log('Must reload extension for modifications to take effect.');

// this content script should only run when we are on the imgur main site (https://imgur.com)
// this site is also reached every time an auth flow finishes
// in this case, we will get the auth token and refresh token from the URL
// only if the auth_token is present, this content script actually does something with side-effects: it stores the obtained auth token and other data in the extension's local storage
console.log('current URL', window.location.href);
const url = window.location.href;
// problem: the auth and refresh token should be part of the URL but aren't URL query params
// so, we use this regex to match the key=value syntax
const paramRegex = /(\w+)=(\w+)/g;
// ... then, extract the two groups that are part of each map
const urlKeysAndVals = [...url.matchAll(paramRegex)].map((arr) => arr.slice(1));
// ... and finally put the keys and values into an object
const urlKeyValObj = {};
urlKeysAndVals.forEach(([key, val]) => {
  urlKeyValObj[key] = val;
});
console.log('found keys and values in URL', urlKeyValObj);
if (urlKeyValObj.access_token) {
  // we probably got whole new set of authentication data
  console.log('setting new value as access_token is present');
  chrome.storage.local.set({ authData: urlKeyValObj });
}
