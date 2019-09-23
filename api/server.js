const express = require("express");
const server = express();
const cors = require("cors");
const helmet = require("helmet");

//const routes = require("./routes");
const checkConsent = require("./middleware/checkConsent");
const authenticate = require("./middleware/authenticate");

server.use(express.json());
server.use(cors());
server.use(helmet());
//server.use("/", routes.authRoutes);
// server.use(authenticate);
// server.use("/user", routes.userRoutes);
// server.use("/providers", routes.providerRoutes);
// server.use("/immunizations", routes.immunizationRoutes);
// server.use("/patients/:id", checkConsent);
// server.use("/patients", routes.patientRoutes);

module.exports = server;
