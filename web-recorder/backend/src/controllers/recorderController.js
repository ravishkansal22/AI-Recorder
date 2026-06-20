const browserService = require("../services/browserService");

async function launch(req, res) {

    const { url } = req.body;

    await browserService.launchBrowser(url);

    res.json({
        success: true
    });
}

module.exports = {
    launch
};