const fs = require("fs");
const { convertToSchema } = require("../src/lib/convertToSchema");

describe("eject", () => {
  it("Case 1: error catch convert to schema", (done) => {
    const config = { pathSource: "path1", pathDestination: "path2" };
    // mock existsSync source
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    // mock existsSync destination
    jest.spyOn(fs, "existsSync").mockReturnValue(true);
    // mock readdir source
    jest.spyOn(fs, "readdirSync").mockImplementation(() => {
      throw new Error("Simulated readdirSync error");
    });
    expect(() =>
      convertToSchema(config.pathFile, config.pathDestination)
    ).toThrowError("Simulated readdirSync error");
    done();
  });

  it("Case 2: error pathSource not exists", () => {
    const config = { pathSource: "path1", pathDestination: "path2" };
    // mock existsSync source
    jest.spyOn(fs, "existsSync").mockReturnValue(false);

    expect(() =>
      convertToSchema(config.pathSource, config.pathDestination)
    ).toThrowError("Error: path1 not exist");    
  });
});
