const express = require("express");
const cors = require("cors");

const recorderRoutes = require("./routes/recorderRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        service: "web-recorder",
        timestamp: new Date()
    });
});

// Recorder APIs
app.use("/api", recorderRoutes);

// Start Server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`🚀 Recorder running on port ${PORT}`);
});