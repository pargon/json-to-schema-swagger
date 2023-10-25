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

      fs.writeFileSync(`${pathOutput}`, newContent, "utf8");
    }
  } catch (error) {
    throw new Error(`Error process ${pathFile}: ${error.message}`);
  }
}

module.exports = { addPropToJSON };
