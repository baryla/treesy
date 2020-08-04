import { Node } from "../Node";
import { Tree } from "../Tree";

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
