import { Tree } from "./Tree";
import { normalizeData } from "./utils";

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
  public parentId: string | null; // null = root.
  public data: Record<string, unknown>;
  public children: Array<Node> = [];
  public tree: Tree;

  constructor(
    idOrData: AddData | string | null,
    parentId: string | null,
    data: Record<string, unknown>,
    tree: Tree
  ) {
    const { id: nodeId, data: nodeData } = normalizeData(idOrData, data);

    this.id = nodeId;
    this.parentId = parentId || null;
    this.data = nodeData || {};
    this.tree = tree;
  }

  get parent(): Node | undefined {
    if (!this.parentId) {
      return undefined;
    }

    return this.tree.find(this.parentId, { deep: true });
  }

  public add(id: string, data: Data): Node;
  public add(data: AddData): Node;
  public add(idOrData: string | AddData, data?: Data): Node {
    const node = new Node(idOrData, this.id, data, this.tree);

    this.children.push(node);

    return node;
  }

  public find(
    criteria: SearchCriteria,
    options?: SearchOptions
  ): Node | undefined {
    return this.tree.find(criteria, options, this);
  }

  public update(dataToUpdate: Record<string, unknown>): Node {
    this.data = dataToUpdate;

    return this;
  }

  public move(criteria: SearchCriteria, index?: number): Node | undefined {
    if (criteria === "root") {
      const node = this.tree.add(this.id, this.data);

      this.remove();

      return node;
    }

    const target = this.tree.find(criteria, { deep: true });
    const parentId = target && target.id;

    if (target) {
      const clonedNode = new Node(this.id, parentId, this.data, this.tree);

      if (typeof index === "number") {
        target.children.splice(index, 0, clonedNode);
      }

      if (typeof index !== "number") {
        target.children.push(clonedNode);
      }

      this.remove();

      return clonedNode;
    }

    return undefined;
  }

  public remove(): void {
    const parent = this.parent;

    parent.children.splice(
      parent.children.findIndex((node) => node.id === this.id),
      1
    );

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
}

export default Node;
