/* eslint-disable guard-for-in, no-restricted-syntax */
const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");

function createObject(prop, obj) {
  return {
    type: typeof obj,
    description: prop,
    example: obj
  };
}

function convertToObject(examples) {
  const properties = {};
  for (const prop in examples) {
    if (Array.isArray(examples[prop])) {
      properties[prop] = {};
      properties[prop].type = "array";
      properties[prop].items = { type: "object" };
      properties[prop].items.properties = convertToObject(examples[prop][0]);
    } else properties[prop] = createObject(prop, examples[prop]);
  }
  return properties;
}

async function addPropToJSON(pathFile, pathOutput) {
  try {
    const data = fs.readFileSync(pathFile, "utf8");
    const objetMatch = data.match(/module.exports\s*=\s*{([\s\S]*?)};/);
    const objetText = objetMatch[1];
    const objetClean = objetText.replace(/\s+/g, "");
    const objetCom = `{${objetClean}}`.replace(/([{,])(\w+):/g, '$1"$2":');
    const objetJSON = JSON.parse(objetCom);
    const objetData = Object.values(objetJSON)[0];

    if (objetData.example) {
      if (Array.isArray(objetData.example)) {
        objetData.type = "array";
        objetData.items = { type: "object" };
        objetData.items.properties = convertToObject(objetData.example[0]);
      } else objetData.properties = convertToObject(objetData.example);

      delete objetData.example;
      const objFinal = {};
      objFinal[Object.keys(objetJSON)[0]] = objetData;

      const newContent = `module.exports=${JSON.stringify(objFinal, null, 2)};`;

      await fs.writeFileSync(`${pathOutput}`, newContent, "utf8");
    }
  } catch (error) {
    throw new Error(`Error process ${pathFile}: ${error.message}`);
  }
}

async function convertToSchema(pathSource, pathDestiny) {
  if (!fse.existsSync(pathSource))
    throw new Error(`Error: ${pathSource} not exist`);
  try {
    if (!fs.existsSync(pathDestiny))
      fs.mkdirSync(pathDestiny, { recursive: true });

    const files = fs.readdirSync(pathSource);

    const filesJSON = await files.filter((file) => !file.endsWith("index.js"));
    await filesJSON.forEach(async (file) => {
      const pathInput = path.join(pathSource, file);
      const pathOutput = path.join(pathDestiny, file);
      await addPropToJSON(pathInput, pathOutput);
    });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = { convertToSchema };
