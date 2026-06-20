function getSelector(element) {

    if (!element) {
        return null;
    }

    // Highest priority
    if (element.getAttribute("data-testid")) {
        return `[data-testid="${element.getAttribute("data-testid")}"]`;
    }

    // ID selector
    if (element.id) {
        return `#${element.id}`;
    }

    // Name selector
    if (element.name) {
        return `[name="${element.name}"]`;
    }

    // Placeholder selector
    if (element.placeholder) {
        return `[placeholder="${element.placeholder}"]`;
    }

    // Button text
    if (
        element.tagName === "BUTTON" &&
        element.innerText
    ) {
        return `text=${element.innerText.trim()}`;
    }

    return element.tagName.toLowerCase();
}

module.exports = {
    getSelector
};