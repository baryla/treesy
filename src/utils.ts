import { Tree } from "./Tree";
import { Node } from "./Node";

import {
  AddData,
  SearchCriteria,
  SearchOptions,
  NormalizedData,
  JsonNode,
} from "./types";

// not a proper uuid but good enough
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function findOnNode(criteria: SearchCriteria) {
  return function (node: Node): boolean {
    if (typeof criteria === "string") {
      return node.id === criteria;
    }

    if (typeof criteria === "function") {
      return criteria(node);
    }

    if (typeof criteria == "object") {
      const copy = {
        id: node.id,
        parentId: node.parentId,
        data: node.data,
      };

      return isSubset(copy, criteria);
    }

    return false;
  };
}

// @credits: https://github.com/studio-b12/is-subset // slightly modified
function isSubset(superset: unknown, subset: unknown) {
  if (
    typeof superset !== "object" ||
    superset === null ||
    typeof subset !== "object" ||
    subset === null
  )
    return false;

  return Object.keys(subset).every((key) => {
    // istanbul ignore if
    // eslint-disable-next-line no-prototype-builtins
    if (!superset.propertyIsEnumerable(key)) return false;

    const subsetItem = subset[key];
    const supersetItem = superset[key];
    if (
      typeof subsetItem === "object" && subsetItem !== null
        ? !isSubset(supersetItem, subsetItem)
        : supersetItem !== subsetItem
    )
      return false;

    return true;
  });
}

export function normalizeData(
  idOrData: string | AddData,
  data?: AddData
): NormalizedData {
  let id: string | undefined;
  let nodeData: AddData;

  if (typeof idOrData === "string") {
    delete data?.id;

    id = idOrData;
    nodeData = data;
  } else {
    id = idOrData?.id || data?.id;

    if (typeof id !== "string") {
      id = uuid();
    }

    if (idOrData && typeof idOrData === "object") {
      delete idOrData.id;
      nodeData = idOrData;
    } else if (data && typeof data === "object") {
      delete data.id;
      nodeData = data;
    }

    nodeData = nodeData || {};
  }

  return { id, data: nodeData };
}

export function find(
  criteria: SearchCriteria,
  tree: Tree,
  options?: SearchOptions,
  node?: Node
): Node | undefined {
  const deep = options?.deep ?? true;

  function internalFind(nodes: Array<Node>) {
    if (!nodes.length) {
      return undefined;
    }

    if (!deep) {
      return nodes.find(findOnNode(criteria));
    }

    return nodes.reduce((acc, curr) => {
      if (findOnNode(criteria)(curr)) {
        return curr;
      }

      return internalFind(curr.children) || acc;
    }, undefined);
  }

  return internalFind(node ? node.children : tree._tree);
}

export function isNode(data: unknown): boolean {
  if (typeof data === "object") {
    return (
      data["id"] &&
      typeof data["id"] === "string" &&
      data["data"] &&
      typeof data["data"] === "object"
    );
  }

  return false;
}

export function assert(value: unknown, message: string): void {
  if (!value) {
    throw new Error(message);
  }
}

function isObject(data: unknown) {
  return typeof data === "object" && data != null;
}

export function generateTreeFromJson(
  jsonTree: Array<JsonNode>,
  tree: Tree
): Tree {
  function traverseJson(jsonTree: Array<JsonNode>): Tree {
    for (const topNode of jsonTree) {
      if (isObject(topNode)) {
        tree.add(generateNode(topNode));
      }
    }

    return tree;
  }

  function generateId(jsonNode: JsonNode): string {
    if (typeof jsonNode.id === "string" && jsonNode.id) {
      return jsonNode.id;
    }

    return uuid();
  }

  function generateData<Data = unknown>(jsonNode: JsonNode<Data>): Data {
    if (isObject(jsonNode.data)) {
      return jsonNode.data || ({} as Data);
    }

    return {} as Data;
  }

  function generateNode(jsonNode: JsonNode): Node {
    const id = generateId(jsonNode);
    const data = generateData(jsonNode);

    const parentNode = new Node(id, data);
    parentNode.tree = tree;

    function addChildrenRecursively(children: Array<JsonNode>, parent: Node) {
      for (const child of children) {
        if (isObject(child)) {
          const childId = generateId(child);
          const childData = generateData(child);

          const childNode = new Node(childId, childData);
          childNode.tree = tree;

          parent.add(childNode);

          if (Array.isArray(child.children)) {
            addChildrenRecursively(child.children, childNode);
          }
        }
      }
    }

    if (Array.isArray(jsonNode.children)) {
      addChildrenRecursively(jsonNode.children, parentNode);
    }

    return parentNode;
  }

  if (!Array.isArray(jsonTree)) {
    throw new Error("Initial tree has to be an array.");
  }

  return traverseJson(jsonTree);
}
