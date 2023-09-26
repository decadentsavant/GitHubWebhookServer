const simpleGit = require("simple-git");
const { exec } = require("child_process");
const { pathToProject } = require("../config");
const isValidSignature = require("../utils/validateSignature");

const git = simpleGit(pathToProject);

async function webhookHandler(req, res) {
    const signature = req.get("X-Hub-Signature");

    // validate webhook signature is from GitHub
    if (!isValidSignature(req, signature)) {
        return res.status(401).send("Mismatched X-Hub-Signature");
    }

    console.log(`Received a push request. Signature: ${signature}`);

    try {
        // reset local changes in branch, pull latest code
        await git.reset(["--hard", "origin/main"]);
        const result = await git.pull("origin", "main");
        console.log("Pull result: " + JSON.stringify(result));
        res.status(202).send("Code pull initiated successfully!");

        // after pull, npm install and build
        exec(
            "npm install && npm run build",
            { cwd: pathToProject },
            (err, stdout, stderr) => {
                if (err) {
                    console.error(`Error building the project: ${err}`);
                    return;
                }
                if (stderr) {
                    console.error(`Error in stderr: ${stderr}`);
                }
                console.log(`Build stdout: ${stdout}`);
            }
        );
    } catch (err) {
        console.error("Error processing the request:", err);
        return res
            .status(500)
            .send("Server encountered an error processing the request.");
    }
}

module.exports = webhookHandler;
