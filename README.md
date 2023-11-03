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
        { key1: "value 1", key2: 999 },
        { key1: "value 2", other2: 888 }
      ]
    }
  }
};
```
where `example` can be a json object with arrays or basic type. The result is:
```javascript
module.exports = {
  ClassName: {
    description: "Class Name",
    type: "object",
    properties: {
      id: {
        type: "number",
        description: "id",
        example: 1
      },
      name: {
        type: "string",
        description: "name",
        example: "Name"
      },
      tags: {
        type: "array",
        items: {
          type: "object",
          properties: {
            key1: {
              type: "string",
              description: "key1",
              example: "value 1"
            },
            key2: {
              type: "number",
              description: "key2",
              example: 999
            }
          }
        }
      }
    }
  }
};
```

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