import { assert } from "../utils";
import { Tree, JsonNode } from "../types";

describe("assert", () => {
  it("should throw if assert condition returns false", () => {
    expect(() => assert(false, "error")).toThrowError();
  });

  it("shouldn't throw if assert condition returns true", () => {
    expect(() => assert(true, "error")).not.toThrow();
  });
});

describe("generateTreeFromJson", () => {
  it("should return a uuid when no id is passed", () => {
    const jsonData = [{}] as Array<JsonNode>;
    const tree = new Tree(jsonData);
    expect(typeof tree.toJson()[0].id).toBe("string");
  });

  it("should return an empty object when no data is passed", () => {
    const jsonData = [{ id: "1", data: "" as any }] as Array<JsonNode>;
    const tree = new Tree(jsonData);
    expect(tree.toJson()[0].data).toEqual({});
  });

  it("should be able to create a tree and add a new node", () => {
    const jsonData = [{ id: "1", data: "" as any }] as Array<JsonNode>;
    const tree = new Tree(jsonData);
    tree.add("cool id");

    expect(tree.toJson()[1].id).toBe("cool id");
  });

  it("should be able to get a parent of a child node", () => {
    const jsonData = ([
      {
        id: "1",
        data: "",
        children: [{ id: "11" }],
      },
    ] as any) as Array<JsonNode>;

    const tree = new Tree(jsonData);
    const parent = tree.find("1");
    const child = tree.find("11");

    expect(child.parent).toBe(parent);
  });
});
