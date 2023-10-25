# jsonToSchemaSwagger
Convert class with object json to schema swagger json, where the input.js:
```javascript
module.exports = {
  ClassName: {
    description: "Class Name",
    type: "object",
    example: {
      id: 1,
      name: "Name",
      tags: [
        { other: "value", other2: "value2" },
        { other: "value3", other2: "value4" }
      ]
    }
  }
};
```
where `example` can be a json object with arrays or basic type

# Usage
Create a js file to process and write:
```javascript
const util = require("json-to-schema-swagger");

const config = {
  pathSource: "./pathsource",
  pathDestination: "./pathdestination"
};

util.eject(config);
```
where `./pathsource` must to exist, however `./pathdestination` will be created if it does not exist