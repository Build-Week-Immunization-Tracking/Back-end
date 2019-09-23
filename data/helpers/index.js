module.exports = {
  ...require("./providers"),
  ...require("./users"),
  ...require("./patients"),
  ...require("./immunizations"),
  ...require("./patient_immunizations"),
  ...require("./permissions")
};
