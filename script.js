const fs = require("fs");
const path = require("path");

// Function to generate server.js from JSON configuration
function generateServer(config) {
    if (!config || !Array.isArray(config.nodes)) {
        console.error("Invalid JSON configuration: 'nodes' must be an array.");
        return;
    }

    // Import statements
    const imports = `const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

`;

    // Middleware functions
    const authMiddleware = `const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

`;

    const adminMiddleware = `const adminMiddleware = (req, res, next) => {
  if (req.headers.authorization !== "Bearer admin-token") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

`;

const loggerMiddleware = `const loggerMiddleware = (req, res, next) => {
  console.log(\`[LOG] \${req.method} \${req.url} at \${new Date().toISOString()}\`);
  next();
};

`;

    let middlewareCode = "";
    let routes = "";
    let usesAuth = false;
    let usesAdmin = false;
    let usesLogger = false;

    // Function to generate routes
    function generateRoute(node) {
        const { endpoint, method, auth_required, admin_required, log_requests } = node.properties;

        if (!endpoint || !method) {
            console.warn(`⚠️ Skipping node '${node.name}' due to missing 'endpoint' or 'method'.`);
            return "";
        }

        const validMethods = ["get", "post", "put", "delete", "patch"];
        const methodLower = method.toLowerCase();

        if (!validMethods.includes(methodLower)) {
            console.warn(`⚠️ Skipping invalid HTTP method '${method}' for endpoint '${endpoint}'.`);
            return "";
        }

        let middlewareList = [];
        if (auth_required) middlewareList.push("authMiddleware");
        if (admin_required) middlewareList.push("adminMiddleware");

        const middlewareStr = middlewareList.length ? `${middlewareList.join(", ")}, ` : "";
        return `app.${methodLower}("${endpoint}", ${middlewareStr}(req, res) => {
  res.json({ message: "This is response from ${node.name}" });
});

`;
    }

    // Process nodes from config
    config.nodes.forEach(node => {
        if (!node.properties || typeof node.properties !== "object") return;

        if (node.properties.type === "middleware") {
            if (node.properties.auth_required) usesAuth = true;
            if (node.properties.admin_required) usesAdmin = true;
            if (node.properties.log_requests) usesLogger = true;
        }

        routes += generateRoute(node);
    });

    if (usesAuth) middlewareCode += authMiddleware;
    if (usesAdmin) middlewareCode += adminMiddleware;
    if (usesLogger) middlewareCode += loggerMiddleware + "app.use(loggerMiddleware);\n\n";

    const serverCode = `${imports}${middlewareCode}${routes}app.use((req, res) => res.status(404).json({ message: "Not Found" }));
app.listen(4000, () => console.log("Server running on port 4000"));
`;

    // Write server.js only if there are changes
    const serverPath = path.join(__dirname, "server.js");
    try {
        if (fs.existsSync(serverPath) && fs.readFileSync(serverPath, "utf-8") === serverCode) {
            console.log(" No changes detected in server.js. Skipping write.");
            return;
        }

        fs.writeFileSync(serverPath, serverCode);
        console.log("✅ server.js generated successfully!");
    } catch (error) {
        console.error("Error writing server.js:", error);
    }
}

// Read and parse config.json
try {
    const configPath = path.join(__dirname, "config.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    generateServer(config);
} catch (error) {
    console.error("Error reading config.json:", error);
}
