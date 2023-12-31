const { convertToSchema } = require("./lib/convertToSchema");

function eject(config) {
  const { pathSource, pathDestination } = config;
  if (!pathSource) throw new Error("Error: pathSource needed to process");
  if (!pathDestination)
    throw new Error("Error: pathDestination needed to process");

  convertToSchema(pathSource, pathDestination);
  process.exit(0);
}

module.exports = { eject };
