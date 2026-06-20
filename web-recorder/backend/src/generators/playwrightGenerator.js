function generatePlaywright(events) {

    let code = `
import { test, expect } from '@playwright/test';

test('Recorded Test', async ({ page }) => {
`;

    for (const event of events) {

        if (event.type === "click") {

            code += `
    await page.click('${event.selector}');
`;
        }

        if (event.type === "input") {

            code += `
    await page.fill(
        '${event.selector}',
        '${event.value}'
    );
`;
        }
    }

    code += `
});
`;

    return code;
}

module.exports = {
    generatePlaywright
};