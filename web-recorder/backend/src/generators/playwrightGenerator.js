function generatePlaywright(events) {

    let code = `
const { test, expect } = require('@playwright/test');

test('Recorded Test', async ({ page }) => {

`;

    events.forEach(event => {

        if (event.type === "navigate") {
            code += `    await page.goto('${event.url}');\n`;
        }

        if (event.type === "click") {
            code += `    await page.click('${event.selector}');\n`;
        }

        if (event.type === "input") {
            code += `    await page.fill('${event.selector}', '${event.value}');\n`;
        }

    });

    code += `
});
`;

    return code;
}

module.exports = {
    generatePlaywright
};