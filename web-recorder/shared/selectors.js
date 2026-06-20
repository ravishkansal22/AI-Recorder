const Selectors = {
  getTestId: (element) => element.getAttribute('data-testid'),
  
  // Return standard css selector hierarchy
  getCssSelector: (element) => {
    if (element.id) return `#${element.id}`;
    if (element.getAttribute('data-testid')) return `[data-testid="${element.getAttribute('data-testid')}"]`;
    
    let path = [];
    while (element.nodeType === Node.ELEMENT_NODE) {
      let selector = element.nodeName.toLowerCase();
      if (element.className) {
        selector += '.' + Array.from(element.classList).join('.');
      }
      path.unshift(selector);
      element = element.parentNode;
    }
    return path.join(' > ');
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Selectors;
}

export default Selectors;
