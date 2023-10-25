/* eslint-disable guard-for-in, no-restricted-syntax */
const fs = require("fs");
const path = require("path");
const { addPropToJSON } = require("./addPropToJSON");

function convertToSchema(pathSource, pathDestiny) {
  if (!fs.existsSync(pathSource))
    throw new Error(`Error: ${pathSource} not exist`);

  try {
    if (!fs.existsSync(pathDestiny))
      fs.mkdirSync(pathDestiny, { recursive: true });

    const files = fs.readdirSync(pathSource);
    const filesJSON = files.filter((file) => !file.endsWith("index.js"));
    filesJSON.forEach((file) => {
      const pathInput = path.join(pathSource, file);
      const pathOutput = path.join(pathDestiny, file);
      addPropToJSON(pathInput, pathOutput);
    });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { convertToSchema };
