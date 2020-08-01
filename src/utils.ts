import { Tree } from "./Tree";
import { Node } from "./Node";

import {
  AddData,
  SearchCriteria,
  SearchOptions,
  NormalizedData,
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

// @credits: https://github.com/studio-b12/is-subset
function isSubset(superset: unknown, subset: unknown) {
  if (
    typeof superset !== "object" ||
    superset === null ||
    typeof subset !== "object" ||
    subset === null
  )
    return false;

  if (superset instanceof Date || subset instanceof Date)
    return superset.valueOf() === subset.valueOf();

  return Object.keys(subset).every((key) => {
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

  function validateAddData(data: AddData) {
    if (!data) {
      return;
    }

    if (data.children) {
      throw new Error(`'children' field isn't allowed to be set.`);
    }
  }

  if (typeof idOrData === "string") {
    validateAddData(data);
    delete data.id;

    id = idOrData;
    nodeData = data;
  } else {
    validateAddData(idOrData);

    id = idOrData?.id || data?.id || uuid();

    if (typeof id !== "string") {
      throw new Error("A Node ID needs to be a string.");
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
  if (node) {
    if (findOnNode(criteria)(node)) {
      return node;
    }

    const deep = options?.deep || false;

    if (!deep) {
      return node.children.find(findOnNode(criteria));
    }

    return node.children.reduce((acc, curr) => {
      if (!findOnNode(criteria)(curr)) {
        return find(criteria, tree, options, curr);
      }

      return curr;
    }, undefined);
  }

  for (const rootNode of tree._tree) {
    const foundNode = find(criteria, tree, options, rootNode);

    if (foundNode) {
      return foundNode;
    }
  }

  return undefined;
}
