/* eslint-disable guard-for-in, no-restricted-syntax */
const fs = require("fs");

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

function addPropToJSON(pathFile, pathOutput) {
  try {
    const data = fs.readFileSync(pathFile, "utf8");
    const objectMatch = data.match(/module.exports\s*=\s*{([\s\S]*?)};/);
    const objectText = objectMatch[1];
    const objectClean = objectText.replace(
      /(?![^"]*"[^"]*(?:"[^"]*"[^"]*)*$)\s+/g,
      ""
    );
    const objectCom = `{${objectClean}}`.replace(/([{,])(\w+):/g, '$1"$2":');
    const objectJSON = JSON.parse(objectCom);
    const objectData = Object.values(objectJSON)[0];

    if (objectData.example) {
      if (Array.isArray(objectData.example)) {
        objectData.type = "array";
        objectData.items = { type: "object" };
        objectData.items.properties = convertToObject(objectData.example[0]);
      } else objectData.properties = convertToObject(objectData.example);

      delete objectData.example;
      const objFinal = {};
      objFinal[Object.keys(objectJSON)[0]] = objectData;

      const newContent = `module.exports=${JSON.stringify(objFinal, null, 2)};`;

      fs.writeFileSync(`${pathOutput}`, newContent, "utf8");
    }
  } catch (error) {
    throw new Error(`Error process ${pathFile}: ${error.message}`);
  }
}

module.exports = { addPropToJSON };
