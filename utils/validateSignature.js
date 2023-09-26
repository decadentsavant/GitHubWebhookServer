const crypto = require("crypto");
const { secret } = require("../config");

function isValidSignature(req, signature) {
    if (!signature) {
        return false;
    }

    const signatureHash = signature.split("=")[1];
    const hmac = crypto.createHmac("sha1", secret);
    const digest = Buffer.from(
        "sha1=" + hmac.update(req.rawBody).digest("hex"),
        "utf8"
    );

    return Buffer.compare(digest, Buffer.from(signature, "utf8")) === 0;
}

module.exports = isValidSignature;
