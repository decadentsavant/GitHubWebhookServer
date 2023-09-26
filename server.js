const https = require("https");
const express = require("express");
const limiter = require("./middlewares/rateLimiter");
const webhookHandler = require("./handlers/webhookHandler");
const { options } = require("./config");

const app = express();

app.use(
    express.json({
        verify: (req, res, buf) => {
            req.rawBody = buf.toString();
        },
    })
);

// apply rate limiter
app.use("/webhook", limiter);

app.get("/", (req, res) => {
    res.send("GitHub webhook server is running");
});

app.post("/webhook", webhookHandler);

https
    .createServer(options, app)
    .listen(9000, "0.0.0.0", () =>
        console.log("GitHub webhook server is listening on port 9000 with HTTPS")
    );
