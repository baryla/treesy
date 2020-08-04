import { Tree } from "./Tree";
import { normalizeData, isNode, assert } from "./utils";

import {
  INode,
  AddData,
  Data,
  SearchCriteria,
  SearchOptions,
  JsonNode,
} from "./types";

export class Node implements INode {
  public id: string;
  public parentId: string | null = null; // null = root.
  public data: Record<string, unknown>;
  public children: Array<Node> = [];
  public _tree: Tree | undefined;

  constructor(
    idOrData: AddData | string | null,
    data?: Record<string, unknown>
  ) {
    const { id: nodeId, data: nodeData } = normalizeData(idOrData, data);

    this.id = nodeId;
    this.data = nodeData || {};
    this.parentId = null;
  }

  get parent(): Node | undefined {
    if (!this.parentId) {
      return undefined;
    }

    return this.tree.find(this.parentId, { deep: true });
  }

  get tree(): Tree | undefined {
    return this._tree;
  }

  set tree(tree: Tree) {
    this._tree = tree;
  }

  public add(id: string, data?: Data): Node;
  public add(dataOrNode: AddData | Node): Node;
  public add(idOrDataOrNode: string | AddData | Node, data?: Data): Node {
    let node: Node;

    if (isNode(idOrDataOrNode)) {
      node = idOrDataOrNode as Node;
      node.data = data || node.data;
    } else {
      const idOrData = idOrDataOrNode as string | AddData;
      node = new Node(idOrData, data);
    }

    node.tree = this.tree;
    node.parentId = this.id;

    this.children.push(node);

    return node;
  }

  public find(
    criteria: SearchCriteria,
    options?: SearchOptions
  ): Node | undefined {
    assert(this.tree, "This Node does not have a tree.");

    return this.tree.find(criteria, options, this);
  }

  public update(dataToUpdate: Record<string, unknown>): Node {
    this.data = dataToUpdate;

    return this;
  }

  public move(criteria: SearchCriteria, index?: number): Node | undefined {
    assert(this.tree, "This Node does not have a tree.");

    if (criteria === "root") {
      this.removeFromParent();

      this.parentId = null;

      if (typeof index === "number") {
        this.tree._tree.splice(index, 0, this);
      }

      if (typeof index !== "number") {
        this.tree._tree.push(this);
      }

      return this;
    }

    const target = this.tree.find(criteria, { deep: true });

    if (!target) {
      return undefined;
    }

    this.removeFromParent();

    this.parentId = target.id;

    if (typeof index === "number") {
      target.children.splice(index, 0, this);
    }

    if (typeof index !== "number") {
      target.children.push(this);
    }

    return this;
  }

  public delete(): void {
    this.removeFromParent();

    for (const prop of Object.keys(this)) {
      delete this[prop];
    }
  }

  public toJson(): JsonNode {
    if (!this.id) {
      // removed node but garage collection
      return {} as JsonNode;
    }

    return {
      id: this.id,
      parentId: this.parentId,
      data: this.data,
      children: this.children.map((node) => node.toJson()),
    };
  }

  private removeFromParent(): void {
    const parent = this.parent;

    if (parent) {
      // this node belongs to another node
      parent.children.splice(
        parent.children.findIndex((node) => node.id === this.id),
        1
      );
    }

    if (this.parentId === null && this.tree) {
      // this node is most likely a root node
      this.tree._tree.splice(
        this.tree._tree.findIndex((node) => node.id === this.id),
        1
      );
    }
  }
}

export default Node;
