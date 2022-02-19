import { Node } from "./Node";
import { find, isNode, generateTreeFromJson } from "./utils";
import {
  Data,
  AddData,
  SearchCriteria,
  SearchOptions,
  JsonNode,
} from "./types";

export class Tree {
  public _tree: Array<Node> = [];

  constructor(jsonTree?: Array<JsonNode>) {
    if (jsonTree) {
      generateTreeFromJson(jsonTree, this);
    }
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
}

export default Tree;
