window.__events = [];

document.addEventListener("click", (e) => {
    const target = e.target;

    window.__events.push({
        type: "click",
        selector: target.id
            ? `#${target.id}`
            : target.tagName.toLowerCase()
    });
});

document.addEventListener("input", (e) => {
    const el = e.target;

    if (
        el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA"
    ) {
        window.__events.push({
            type: "input",
            selector: el.id
                ? `#${el.id}`
                : el.tagName.toLowerCase(),
            value: el.value
        });
    }
});