require("dotenv").config();
const server = require("./api/server");
const { port } = require("./config/secrets");

server.listen(port, () => console.log(`Server listening on port ${port}.`));
