import { Node } from "../Node";
import { Tree } from "../Tree";
import { JsonNode } from "../types";

import smallJsonTree from "../__fixtures__/small-json-tree.json";
import largeJsonTree from "../__fixtures__/large-json-tree.json";

it("should initialise a new tree", () => {
  expect(new Tree()._tree).toEqual([]);
});

it("should add a new node to the tree", () => {
  const tree = new Tree();
  const id = "__ID__";
  const data = {};

  tree.add(id, data);

  expect(tree.toJson()).toEqual([{ id, parentId: null, data, children: [] }]);
});

it("should find a new node based on the given criteria", () => {
  const tree = new Tree();
  const id = "__ID__";
  const data = {};

  tree.add(id, data);

  const foundNode = tree.find(id);

  expect(foundNode.id).toBe(id);
});

it("should be able to add an instantiated node", () => {
  const tree = new Tree();
  const id = "__ID__";

  const node = new Node(id, {});
  tree.add(node);

  expect(tree._tree.length).toBe(1);
  expect(tree.toJson()[0].id).toBe(id);
});

it("should generate a tree from a small json array", () => {
  const tree = new Tree(smallJsonTree as Array<JsonNode>);

  expect(tree.toJson()).toEqual(smallJsonTree);
});

it("should generate a tree from a large json array", () => {
  const tree = new Tree(largeJsonTree as Array<JsonNode>);

  expect(tree.toJson()).toEqual(largeJsonTree);
});

it("should throw when generating tree if it's not an array", () => {
  expect(() => new Tree({} as any)).toThrow();
});

it("should find a nested node on a tree", () => {
  const tree = new Tree(smallJsonTree as Array<JsonNode>);
  const id = "311111";

  expect(tree.find(id).id).toBe(id);
});
