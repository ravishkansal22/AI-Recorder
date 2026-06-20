// Code generators for different testing frameworks based on captured steps

export function generatePlaywright(steps) {
  let code = `// —- AAI Recorder v3 • Playwright TypeScript ——————————————— // Mode: Automation | Execution: Headed (Debug) | RDD: ON // Self-heal: ON | DB Assert: ON | AI Assert: ON
import { test, expect } from '@playwright/test';
import { SelfHeal } from '@aai/heal';
import { TestDataFactory } from '@aai/data-gen';
import { DbAssert } from '@aai/db-assert';
import { AiAssert } from '@aai/assert';

test('Checkout - P95 Production Path', async ({ page }) => {
  const data = TestDataFactory.generate({ schema: 'checkout' });\n`;

  steps.forEach((step, index) => {
    const num = index + 1;
    if (step.type === 'Navigate') {
      code += `  // Step ${num}: Navigate (browser visible in headed mode)\n`;
      code += `  await page.goto('${step.details}');\n`;
    } else if (step.type === 'Click' && step.selfHealed) {
      code += `  // Step ${num}: 6-tier self-healing locator\n`;
      code += `  await SelfHeal.click(page, {\n`;
      code += `    tier1: '[data-testid="add-to-cart-btn"]',\n`;
      code += `    tier2: 'role=button[name="Add to Cart"]',\n`;
      code += `    tier3: 'button:has-text("Add to Cart")'\n`;
      code += `  });\n`;
    } else if (step.type === 'Click' && step.details.includes('checkout-submit')) {
      code += `  // Step ${num}: Submit (HEALED - Tier 2 ARIA adopted)\n`;
      code += `  await page.click('role=button[name="Place Order"]');\n`;
    } else if (step.type === 'Click') {
      code += `  // Step ${num}: Click action\n`;
      code += `  await page.click('${step.details}');\n`;
    } else if (step.type === 'Type') {
      code += `  // Step ${num}: Parametrized via data factory\n`;
      code += `  await page.fill('#email-field', data.email);\n`;
    } else if (step.type === 'Assert') {
      code += `  // Step ${num}: Assertions - AI + User + DB combined\n`;
      code += `  await expect(page.locator('.order-total')).toContainText('$49.99');\n`;
      code += `  // + AI-generated assertions (auto-suggested from page context)\n`;
      code += `  await AiAssert.run(page, 'order summary is visible and complete');\n`;
      code += `  await AiAssert.wcag(page, { level: 'AA' });\n`;
      code += `  // DB check - verify order created in database\n`;
      code += `  await DbAssert.query({\n`;
      code += `    connection: 'orders_db',\n`;
      code += `    sql: 'SELECT status FROM orders WHERE email = ?',\n`;
      code += `    params: [data.email],\n`;
      code += `    expect: { status: 'pending' }\n`;
      code += `  });\n`;
    } else if (step.type === 'Assert URL') {
      code += `  // Step ${num}: Assert URL\n`;
      code += `  await expect(page).toHaveURL(/order-confirmation/);\n`;
    }
  });

  if (steps.length === 0) {
    code += `  // Waiting for action...\n`;
  }

  code += `});`;
  return code;
}

export function generateSelenium(steps) {
  let code = `// —- AAI Recorder v3 • Selenium Java ——————————————— // Mode: Automation | Execution: Headed (Debug) | RDD: ON // Self-heal: ON | DB Assert: ON | AI Assert: ON
package com.scriptstudio.tests;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import com.aai.heal.SelfHeal;
import com.aai.datagen.TestDataFactory;
import com.aai.asserts.AiAssert;
import com.aai.db.DbAssert;

public class CheckoutTest {
    private WebDriver driver;
    private TestDataFactory dataFactory;

    @BeforeMethod
    public void setUp() {
        driver = new ChromeDriver();
        dataFactory = new TestDataFactory();
    }

    @Test
    public void testCheckoutP95Path() {
        var data = dataFactory.generate("checkout");\n`;

  steps.forEach((step, index) => {
    const num = index + 1;
    if (step.type === 'Navigate') {
      code += `        // Step ${num}: Navigate (browser visible in headed mode)\n`;
      code += `        driver.get("${step.details}");\n`;
    } else if (step.type === 'Click' && step.selfHealed) {
      code += `        // Step ${num}: 6-tier self-healing locator\n`;
      code += `        SelfHeal.click(driver, new String[]{\n`;
      code += `            "[data-testid='add-to-cart-btn']",\n`;
      code += `            "role=button[name='Add to Cart']",\n`;
      code += `            "button:has-text('Add to Cart')"\n`;
      code += `        });\n`;
    } else if (step.type === 'Click' && step.details.includes('checkout-submit')) {
      code += `        // Step ${num}: Submit (HEALED - Tier 2 ARIA adopted)\n`;
      code += `        SelfHeal.click(driver, ".checkout-submit");\n`;
    } else if (step.type === 'Click') {
      code += `        // Step ${num}: Click action\n`;
      code += `        driver.findElement(By.cssSelector("${step.details}")).click();\n`;
    } else if (step.type === 'Type') {
      code += `        // Step ${num}: Parametrized via data factory\n`;
      code += `        driver.findElement(By.id("email-field")).sendKeys(data.get("email"));\n`;
    } else if (step.type === 'Assert') {
      code += `        // Step ${num}: Assertions - AI + User + DB combined\n`;
      code += `        WebElement total = driver.findElement(By.className("order-total"));\n`;
      code += `        Assert.assertTrue(total.getText().contains("$49.99"));\n`;
      code += `        // + AI-generated assertions (auto-suggested from page context)\n`;
      code += `        AiAssert.run(driver, "order summary is visible and complete");\n`;
      code += `        AiAssert.wcag(driver, "AA");\n`;
      code += `        // DB check - verify order created in database\n`;
      code += `        DbAssert.query("orders_db", \n`;
      code += `            "SELECT status FROM orders WHERE email = ?", \n`;
      code += `            new Object[]{data.get("email")}, \n`;
      code += `            "pending");\n`;
    } else if (step.type === 'Assert URL') {
      code += `        // Step ${num}: Assert URL\n`;
      code += `        Assert.assertTrue(driver.getCurrentUrl().matches(".*/order-confirmation.*"));\n`;
    }
  });

  if (steps.length === 0) {
    code += `        // Waiting for action...\n`;
  }

  code += `    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}`;
  return code;
}

export function generateCypress(steps) {
  let code = `// —- AAI Recorder v3 • Cypress ——————————————— // Mode: Automation | Execution: Headed (Debug) | RDD: ON // Self-heal: ON | DB Assert: ON | AI Assert: ON
import { SelfHeal } from '@aai/heal-cypress';
import { TestDataFactory } from '@aai/data-gen-cypress';
import { DbAssert } from '@aai/db-assert-cypress';
import { AiAssert } from '@aai/assert-cypress';

describe('E-Commerce Checkout Flow', () => {
  it('Checkout - P95 Production Path', () => {
    const data = TestDataFactory.generate({ schema: 'checkout' });\n`;

  steps.forEach((step, index) => {
    const num = index + 1;
    if (step.type === 'Navigate') {
      code += `    // Step ${num}: Navigate (browser visible in headed mode)\n`;
      code += `    cy.visit('${step.details}');\n`;
    } else if (step.type === 'Click' && step.selfHealed) {
      code += `    // Step ${num}: 6-tier self-healing locator\n`;
      code += `    SelfHeal.click({\n`;
      code += `      tier1: '[data-testid="add-to-cart-btn"]',\n`;
      code += `      tier2: 'role=button[name="Add to Cart"]',\n`;
      code += `      tier3: 'button:has-text("Add to Cart")'\n`;
      code += `    });\n`;
    } else if (step.type === 'Click' && step.details.includes('checkout-submit')) {
      code += `    // Step ${num}: Submit (HEALED - Tier 2 ARIA adopted)\n`;
      code += `    SelfHeal.click('.checkout-submit');\n`;
    } else if (step.type === 'Click') {
      code += `    // Step ${num}: Click action\n`;
      code += `    cy.get('${step.details}').click();\n`;
    } else if (step.type === 'Type') {
      code += `    // Step ${num}: Parametrized via data factory\n`;
      code += `    cy.get('#email-field').type(data.email);\n`;
    } else if (step.type === 'Assert') {
      code += `    // Step ${num}: Assertions - AI + User + DB combined\n`;
      code += `    cy.get('.order-total').should('contain', '$49.99');\n`;
      code += `    // + AI-generated assertions (auto-suggested from page context)\n`;
      code += `    AiAssert.run('order summary is visible and complete');\n`;
      code += `    AiAssert.wcag({ level: 'AA' });\n`;
      code += `    // DB check - verify order created in database\n`;
      code += `    DbAssert.query({\n`;
      code += `      connection: 'orders_db',\n`;
      code += `      sql: 'SELECT status FROM orders WHERE email = ?',\n`;
      code += `      params: [data.email],\n`;
      code += `      expect: { status: 'pending' }\n`;
      code += `    });\n`;
    } else if (step.type === 'Assert URL') {
      code += `    // Step ${num}: Assert URL\n`;
      code += `    cy.url().should('match', /order-confirmation/);\n`;
    }
  });

  if (steps.length === 0) {
    code += `    // Waiting for action...\n`;
  }

  code += `  });
});`;
  return code;
}

export function generatePuppeteer(steps) {
  let code = `// —- AAI Recorder v3 • Puppeteer ——————————————— // Mode: Automation | Execution: Headed (Debug) | RDD: ON // Self-heal: ON | DB Assert: ON | AI Assert: ON
const puppeteer = require('puppeteer');
const { SelfHeal } = require('@aai/heal-puppeteer');
const { TestDataFactory } = require('@aai/data-gen');
const { DbAssert } = require('@aai/db-assert');
const { AiAssert } = require('@aai/assert');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const data = TestDataFactory.generate({ schema: 'checkout' });\n`;

  steps.forEach((step, index) => {
    const num = index + 1;
    if (step.type === 'Navigate') {
      code += `  // Step ${num}: Navigate (browser visible in headed mode)\n`;
      code += `  await page.goto('${step.details}');\n`;
    } else if (step.type === 'Click' && step.selfHealed) {
      code += `  // Step ${num}: 6-tier self-healing locator\n`;
      code += `  await SelfHeal.click(page, {\n`;
      code += `    tier1: '[data-testid="add-to-cart-btn"]',\n`;
      code += `    tier2: 'role=button[name="Add to Cart"]',\n`;
      code += `    tier3: 'button:has-text("Add to Cart")'\n`;
      code += `  });\n`;
    } else if (step.type === 'Click' && step.details.includes('checkout-submit')) {
      code += `  // Step ${num}: Submit (HEALED - Tier 2 ARIA adopted)\n`;
      code += `  await SelfHeal.click(page, '.checkout-submit');\n`;
    } else if (step.type === 'Click') {
      code += `  // Step ${num}: Click action\n`;
      code += `  await page.click('${step.details}');\n`;
    } else if (step.type === 'Type') {
      code += `  // Step ${num}: Parametrized via data factory\n`;
      code += `  await page.type('#email-field', data.email);\n`;
    } else if (step.type === 'Assert') {
      code += `  // Step ${num}: Assertions - AI + User + DB combined\n`;
      code += `  const totalElement = await page.$('.order-total');\n`;
      code += `  const text = await page.evaluate(el => el.textContent, totalElement);\n`;
      code += `  if (!text.includes('$49.99')) throw new Error('Assertion failed');\n`;
      code += `  // + AI-generated assertions (auto-suggested from page context)\n`;
      code += `  await AiAssert.run(page, 'order summary is visible and complete');\n`;
      code += `  await AiAssert.wcag(page, { level: 'AA' });\n`;
      code += `  // DB check - verify order created in database\n`;
      code += `  await DbAssert.query({\n`;
      code += `    connection: 'orders_db',\n`;
      code += `    sql: 'SELECT status FROM orders WHERE email = ?',\n`;
      code += `    params: [data.email],\n`;
      code += `    expect: { status: 'pending' }\n`;
      code += `  });\n`;
    } else if (step.type === 'Assert URL') {
      code += `  // Step ${num}: Assert URL\n`;
      code += `  const url = page.url();\n`;
      code += `  if (!/order-confirmation/.test(url)) throw new Error('Assertion failed');\n`;
    }
  });

  if (steps.length === 0) {
    code += `  // Waiting for action...\n`;
  }

  code += `\n  await browser.close();
})();`;
  return code;
}

export function generateCode(steps, framework) {
  switch (framework) {
    case 'playwright':
      return generatePlaywright(steps);
    case 'selenium':
      return generateSelenium(steps);
    case 'cypress':
      return generateCypress(steps);
    case 'puppeteer':
      return generatePuppeteer(steps);
    default:
      return generatePlaywright(steps);
  }
}
