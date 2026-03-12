// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}


// This function can render ANY list with ANY template anywhere on the site
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  // 1. If 'clear' is true, wipe the element clean first
  if (clear) {
    parentElement.innerHTML = "";
  }
  
  // 2. Use the 'templateFn' (the machine) to turn objects into HTML
  const htmlStrings = list.map(templateFn);
  
  // 3. Put the finished HTML into the page at the right position
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}