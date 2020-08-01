import { Node } from "./Node";
import { find } from "./utils";
import {
  INode,
  Data,
  AddData,
  SearchCriteria,
  SearchOptions,
  JsonNode,
} from "./types";

export class Tree implements INode {
  public _tree: Array<Node> = [];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(initialNodes?: Tree | unknown) {
    // this.generateTree(initialNodes);
  }

  public add(id: string, data: Data): Node;
  public add(data: AddData): Node;
  public add(idOrData: string | AddData, data?: Data): Node {
    const node = new Node(idOrData, null, data, this);

    this._tree.push(node);

    return node;
  }

  public find(
    criteria: SearchCriteria,
    options?: SearchOptions,
    node?: Node
  ): Node | undefined {
    return find(criteria, this, options, node);
  }

  public toJson(): Array<JsonNode> {
    return this._tree.map((node) => node.toJson());
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private generateTree(initialNodes?: Tree | unknown) {
    // we can use this to clone a tree ot create an entirely new one

    throw new Error("Not yet supported.");
  }
}

export default Tree;
