const path = require("path");
const fs = require("fs");
const jsonServer = require("json-server");

const server = jsonServer.create();
const dbFilePath = path.join(__dirname, "db.json");
const router = jsonServer.router(dbFilePath);
const middlewares = jsonServer.defaults();

const port = process.env.PORT || 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    dbFilePath,
    dbExists: fs.existsSync(dbFilePath),
  });
});

server.get("/", (req, res) => {
  res.status(200).json({
    message: "Inventory API is running",
    endpoints: ["/health", "/users", "/products"],
  });
});

// Add CORS headers
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  next();
});

server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`Using DB file: ${dbFilePath}`);
});
