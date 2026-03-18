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

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}
  // Render a single template
  export function renderWithTemplate(template, parentElement, data, callback) {
    parentElement.innerHTML = template;
    if (callback) {
      callback(data);
    }
  }

  // Load HTML template from file
  export async function loadTemplate(path) {
    const response = await fetch(path);
    const html = await response.text();
    return html;
  }

  // Load header and footer templates and render them
  export async function loadHeaderFooter() {
    const headerHtml = await loadTemplate('/src/public/header.html');
    const footerHtml = await loadTemplate('/src/public/footer.html');
    const headerElement = document.getElementById('site-header');
    const footerElement = document.getElementById('site-footer');
    renderWithTemplate(headerHtml, headerElement);
    renderWithTemplate(footerHtml, footerElement);
  }
