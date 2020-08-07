import { Tree } from "../Tree";
import { Node } from "../Node";

it("should create a new node with valid data", () => {
  const nodeId = "__ID__";
  const node = new Node(nodeId);

  expect(node.id).toBe(nodeId);
  expect(node.data).toEqual({});
});

it("should be able to get the parent", () => {
  const parentId = "__PARENT_ID__";
  const nodeId = "__ID__";

  const tree = new Tree();
  const parentNode = tree.add({ id: parentId });
  const childNode = parentNode.add(nodeId, {});

  expect(parentNode.parent).toBeUndefined();
  expect(childNode.parent.id).toBe(parentId);
});

it("should throw if tree does not exist on node but parent is requested", () => {
  const parentNode = new Node("ID", {});
  const childNode = parentNode.add("ID2", {});

  expect(() => childNode.parent).toThrow();
});

it("should be able to add an instantiated node", () => {
  const parentId = "__PARENT_ID__";
  const nodeId = "__ID__";

  const tree = new Tree();
  const parentNode = tree.add(parentId, {});
  const childNode = new Node(nodeId, {});

  expect(childNode.parentId).toBeNull();
  parentNode.add(childNode);

  expect(childNode.parentId).toBe(parentId);
  expect(parentNode.children[0].id).toBe(nodeId);
});

it("should find a new node based on the given criteria", () => {
  const tree = new Tree();
  const parentId = "__PARENT_ID__";
  const childId = "__CHILD_ID__";
  const grandChildId = "__GRAND_CHILD_ID__";

  const parentNode = tree.add(parentId, {});
  const childNode = parentNode.add(childId);

  childNode.add(grandChildId);

  expect(parentNode.find(childId)).toEqual(childNode);
  expect(parentNode.find((node) => node.id === childId)).toEqual(childNode);
  expect(parentNode.find({ id: childId })).toEqual(childNode);
  expect(parentNode.find(undefined)).toBeUndefined();
  expect(parentNode.find(null)).toBeUndefined();
  expect(parentNode.find(grandChildId, { deep: false })).toBeUndefined();
});

it("should not find a node that isn't a direct child", () => {
  const tree = new Tree();
  const parentId = "__PARENT_ID__";
  const childId = "__CHILD_ID__";
  const grandChildId = "__GRAND_CHILD_ID__";

  const parentNode = tree.add(parentId, {});
  const childNode = parentNode.add(childId);
  const grandChildNode = childNode.add(grandChildId);

  expect(childNode.find(parentId)).toBeUndefined();
  expect(childNode.find(grandChildId)).toEqual(grandChildNode);
});

it("should update the node", () => {
  const tree = new Tree();
  const nodeId = "__ID__";

  const node = tree.add(nodeId, {});
  expect(node.data).toEqual({});
  expect(tree.toJson()[0].data).toEqual({});

  node.update({ test: 123 });

  expect(node.data).toEqual({ test: 123 });
  expect(tree.toJson()[0].data).toEqual({ test: 123 });
});

it("should move the node to the root of the tree", () => {
  const parentId = "__PARENT_ID__";
  const nodeId = "__ID__";

  const tree = new Tree();
  const parentNode = tree.add(parentId, {});
  const childNode = parentNode.add(nodeId, {});

  expect(parentNode.children[0].id).toBe(nodeId);
  expect(tree._tree.length).toBe(1);

  childNode.move("root");

  expect(parentNode.children).toEqual([]);
  expect(tree._tree.length).toBe(2);
});

it("should move the node to the root of the tree by a specific index", () => {
  const parentId = "__PARENT_ID__";
  const nodeId = "__ID__";

  const tree = new Tree();
  const parentNode = tree.add(parentId, {});
  const childNode = parentNode.add(nodeId, {});

  expect(tree._tree[0].id).toBe(parentId);

  childNode.move("root", 0);

  expect(tree._tree[0].id).toBe(nodeId);
  expect(tree._tree[1].id).toBe(parentId);
});

it("should move the node to another node", () => {
  const parentId = "__PARENT_ID__";
  const siblingId = "__SIBLING_ID__";

  const tree = new Tree();
  const parentNode = tree.add(parentId, {});
  const siblingNode = tree.add(siblingId, {});

  expect(tree._tree.length).toBe(2);
  expect(parentNode.children.length).toBe(0);

  siblingNode.move(parentId);

  expect(tree._tree.length).toBe(1);
  expect(parentNode.children.length).toBe(1);
});

it("should move the node to another node by index", () => {
  const parentId = "__PARENT_ID__";
  const childId = "__CHILD_ID__";
  const siblingId = "__SIBLING_ID__";

  const tree = new Tree();
  const parentNode = tree.add(parentId, {});
  const siblingNode = tree.add(siblingId, {});

  parentNode.add(childId, {});

  expect(tree._tree.length).toBe(2);
  expect(parentNode.children.length).toBe(1);
  expect(parentNode.children[0].id).toBe(childId);

  siblingNode.move(parentId, 1);

  expect(tree._tree.length).toBe(1);
  expect(parentNode.children.length).toBe(2);
  expect(parentNode.children[1].id).toBe(siblingId);
});

it("should not move if the target node is not found", () => {
  const parentId = "__PARENT_ID__";
  const childId = "__CHILD_ID__";
  const siblingId = "__SIBLING_ID__";

  const tree = new Tree();
  const parentNode = tree.add(parentId, {});
  const siblingNode = tree.add(siblingId, {});

  parentNode.add(childId, {});

  expect(tree._tree.length).toBe(2);
  expect(parentNode.children.length).toBe(1);
  expect(parentNode.children[0].id).toBe(childId);

  siblingNode.move("ABC");

  expect(tree._tree.length).toBe(2);
  expect(parentNode.children.length).toBe(1);
  expect(parentNode.children[0].id).toBe(childId);
});

it("should be able delete the node", () => {
  const nodeId = "__NODE_ID__";

  const tree = new Tree();
  const node = tree.add(nodeId, {});

  expect(tree._tree.length).toBe(1);

  node.delete();

  expect(node.tree).toBeUndefined();
  expect(node.toJson()).toEqual({});
});

it("should generate the JSON recursively for the node", () => {
  const nodeId = "__NODE_ID__";
  const siblingId = "__SIBLING_ID__";

  const node = new Node(nodeId);
  const sibling = new Node(siblingId);

  node.add(sibling);

  expect(node.toJson()).toEqual({
    id: nodeId,
    parentId: null,
    data: {},
    children: [{ id: siblingId, parentId: nodeId, data: {}, children: [] }],
  });
});

it("should override the ID of the node if it's not a string", () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const node1 = new Node(1);
  expect(typeof node1.id).toBe("string");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const node2 = new Node({ id: 1 });
  expect(typeof node2.id).toBe("string");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const node3 = new Node({}, { id: 1 });
  expect(typeof node3.id).toBe("string");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const node4 = new Node({}, { id: 1 });
  expect(typeof node4.id).toBe("string");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const node5 = new Node(null, { id: 1 });
  expect(typeof node5.id).toBe("string");
});
