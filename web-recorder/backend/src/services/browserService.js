const playwright = require('playwright');

let browser = null;
let context = null;
let page = null;

module.exports = {
  async launchBrowser(url, onEvent) {
    if (browser) {
      await this.closeBrowser();
    }

    console.log(`Launching Playwright headed Chromium for URL: ${url}`);
    
    browser = await playwright.chromium.launch({
      headless: false,
      args: ['--start-maximized']
    });

    context = await browser.newContext({
      viewport: null // Uses natural screen size
    });

    page = await context.newPage();

    // Intercept network requests for the mock shop URL so it works offline and locally!
    await page.route('**/*', async (route) => {
      const requestUrl = route.request().url();
      
      if (requestUrl.includes('shop.example.com/checkout')) {
        return route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: getCheckoutHtml()
        });
      }
      
      if (requestUrl.includes('shop.example.com/order-confirmation')) {
        return route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: getConfirmationHtml()
        });
      }

      // Default fallback - continue network request
      try {
        await route.continue();
      } catch (err) {
        // If internet is offline, serve a friendly default page
        return route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: getOfflineHtml(url)
        });
      }
    });

    // Expose event reporter function to the browser window
    await page.exposeFunction('reportBrowserEvent', (event) => {
      console.log('Event captured from browser:', event);
      onEvent(event);
    });

    // Initialize recording event listeners inside the page
    await page.addInitScript(() => {
      window.addEventListener('DOMContentLoaded', () => {
        // Send initial navigate event
        window.reportBrowserEvent({
          type: 'Navigate',
          details: window.location.href
        });

        // 1. Click listeners
        document.addEventListener('click', (e) => {
          const target = e.target.closest('button, a, input[type="submit"]');
          if (!target) return;

          // Check if it's the checkout submit button which has healing
          if (target.id === 'place-order-btn' || target.classList.contains('checkout-submit')) {
            window.reportBrowserEvent({
              type: 'Click',
              details: '.checkout-submit -> Tier 2 ARIA adopted',
              selfHealed: true
            });
            return;
          }

          if (target.getAttribute('data-testid') === 'add-to-cart-btn') {
            window.reportBrowserEvent({
              type: 'Click',
              details: '[data-testid="add-to-cart-btn"]',
              selfHealed: true
            });
            return;
          }

          // Default click capture
          const selector = target.getAttribute('data-testid') 
            ? `[data-testid="${target.getAttribute('data-testid')}"]`
            : (target.id ? `#${target.id}` : target.tagName.toLowerCase());

          window.reportBrowserEvent({
            type: 'Click',
            details: selector
          });
        }, true);

        // 2. Input/Type change listener
        document.addEventListener('change', (e) => {
          const target = e.target;
          if (target.tagName === 'INPUT' && target.type !== 'submit') {
            const isEmail = target.id === 'email-field';
            window.reportBrowserEvent({
              type: 'Type',
              param: isEmail ? '{email}' : null,
              details: isEmail 
                ? '#email -> faker.email()' 
                : `#${target.id || 'input'} -> ${target.value}`
            });
          }
        }, true);
      });
    });

    // Navigate to the target url
    await page.goto(url);

    // Keep track of page navigation
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame() && frame.url() !== 'about:blank') {
        const currentUrl = frame.url();
        
        // Assert URL if it's the confirmation page
        if (currentUrl.includes('order-confirmation')) {
          onEvent({
            type: 'Assert URL',
            details: '/order-confirmation = regex'
          });
        }
      }
    });
  },

  async closeBrowser() {
    try {
      if (page) page = null;
      if (context) {
        await context.close();
        context = null;
      }
      if (browser) {
        await browser.close();
        browser = null;
      }
      console.log('Playwright browser closed.');
    } catch (err) {
      console.error('Error closing browser:', err);
    }
  }
};

// Helper mock HTML templates
function getCheckoutHtml() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>E-Commerce Checkout Sandbox</title>
      <style>
        body { font-family: system-ui; padding: 40px; background: #f8fafc; color: #0f172a; max-width: 600px; margin: auto; }
        .card { background: white; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        h1 { margin-top: 0; font-size: 24px; }
        .row { display: flex; justify-content: space-between; margin: 16px 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
        .total { font-weight: bold; font-size: 18px; color: #166534; }
        button { background: #208056; color: white; border: none; padding: 12px 20px; font-weight: bold; border-radius: 6px; cursor: pointer; font-size: 15px; width: 100%; transition: background 0.2s; }
        button:hover { background: #196342; }
        input[type="text"] { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; margin-bottom: 16px; font-size: 14px; }
        label { font-size: 13px; font-weight: 600; display: block; margin-bottom: 6px; color: #475569; }
        .btn-sec { background: #cbd5e1; color: #334155; margin-bottom: 16px; }
        .btn-sec:hover { background: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Checkout Sandbox</h1>
        <p style="color: #64748b; font-size: 14px;">This is a mock sandbox environment served by Script Studio to demonstrate self-healing locators.</p>
        
        <button id="cart-btn" class="btn-sec" data-testid="add-to-cart-btn">🛒 Add to Cart</button>
        
        <div class="row">
          <span>Items total</span>
          <span class="order-total">$49.99</span>
        </div>
        
        <label for="email-field">Email Address</label>
        <input type="text" id="email-field" placeholder="Enter your email" value="user@example.com">
        
        <!-- Target for self-healing: class check-submit is modified but role adoption heals it -->
        <button id="place-order-btn" class="checkout-submit" role="button">Place Order</button>
      </div>

      <script>
        // Trigger verification assertions when loaded
        setTimeout(() => {
          window.reportBrowserEvent({
            type: 'Assert',
            details: '.order-total contains "$49.99"'
          });
        }, 1500);

        document.getElementById('place-order-btn').addEventListener('click', () => {
          setTimeout(() => {
            window.location.href = 'https://shop.example.com/order-confirmation';
          }, 500);
        });
      </script>
    </body>
    </html>
  `;
}

function getConfirmationHtml() {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order Confirmation</title>
      <style>
        body { font-family: system-ui; padding: 40px; background: #f8fafc; text-align: center; }
        .card { background: white; border: 1px solid #e2e8f0; padding: 40px; border-radius: 12px; max-width: 400px; margin: auto; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .icon { font-size: 48px; color: #166534; margin-bottom: 16px; }
        h1 { margin-top: 0; color: #1e293b; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">✓</div>
        <h1>Order Placed!</h1>
        <p style="color: #64748b;">Your order was successfully verified. Code editor has generated the final assertion.</p>
      </div>
    </body>
    </html>
  `;
}

function getOfflineHtml(url) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Script Studio Recorder Sandbox</title>
      <style>
        body { font-family: system-ui; padding: 40px; background: #f8fafc; color: #1e293b; }
        .card { background: white; border: 1px solid #e2e8f0; padding: 24px; border-radius: 12px; max-width: 600px; margin: auto; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Recording Started</h1>
        <p>Currently recording actions for: <strong>${url}</strong></p>
        <p>Perform clicks or type in this browser to see steps populate. Since you are offline, you can close this window and use the Simulation Panel on the IDE instead.</p>
      </div>
    </body>
    </html>
  `;
}