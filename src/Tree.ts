import { Node } from "./Node";
import { find, isNode } from "./utils";
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

  public add(id: string, data?: Data): Node;
  public add(dataOrNode: AddData | Node): Node;
  public add(idOrDataOrNode: string | AddData | Node, data?: Data): Node {
    let node: Node;

    if (isNode(idOrDataOrNode)) {
      node = idOrDataOrNode as Node;
    } else {
      const idOrData = idOrDataOrNode as string | AddData;
      node = new Node(idOrData, data);
    }

    node.tree = this;
    node.parentId = null;

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

  // istanbul ignore next
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private generateTree(initialNodes?: Tree | unknown) {
    // we can use this to clone a tree ot create an entirely new one

    throw new Error("Not yet supported.");
  }
}

export default Tree;
