const fs = require("fs");
const { eject } = require("../src/index");

describe("eject", () => {
  let dataFile1;
  let dataFile2;
  let sourceFiles;

  beforeEach(async () => {
    dataFile1 =
      'module.exports = {objOutput1: {description: "ProyectosFiltro",type: "object",example: {id: 1,nombre: "PROYECTO PRUEBA"}}};';
    dataFile2 =
      'module.exports = {objOutput2: {description: "ProyectosFiltro",type: "object",example: [{id: 1,extras:[ {description:"PROYECTO PRUEBA"}]} ]}};';
    sourceFiles = ["file1.js", "files2.js"];
  });
  //
  it("Case 1: error pathSource not exists", () => {
    expect(() => eject({ pathDestination: "destinyPath" })).toThrowError(
      "Error: pathSource needed to process"
    );
  });

  it("Case 2: error pathDestination not exists", () => {
    expect(() => eject({ pathSource: "sourcePath" })).toThrowError(
      "Error: pathDestination needed to process"
    );
  });

  it("Case 3: success", (done) => {
    const config = { pathSource: "path1", pathDestination: "path2" };

    // mock existsSync source
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    // mock existsSync destination
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    // mock readdir source
    jest.spyOn(fs, "readdirSync").mockReturnValue(sourceFiles);
    // mock readFileSync source1 - add prop to json
    jest.spyOn(fs, "readFileSync").mockReturnValue(dataFile1);
    // mock readFileSync source2 - add prop to json
    jest.spyOn(fs, "readFileSync").mockReturnValue(dataFile2);
    // mock writeFileSync
    jest.spyOn(fs, "writeFileSync").mockReturnValue(true);

    const originalExit = process.exit;
    process.exit = (code) => {
      expect(code).toBe(0);
      process.exit = originalExit;
      done();
    };

    eject(config);
  });
});
