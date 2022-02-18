import { Tree } from "./Tree";
import { Node } from "./Node";

export interface INode {
  add(id: string, data: AddData): Node;
  add(dataOrNode: AddData | Node): Node;
  find(searchCriteria: SearchCriteria): Node | undefined;
  toJson();
}

export type AddData = {
  id?: string;
} & Data;

export type Data = Record<string, unknown>;

export type SearchCriteria =
  | ((node: Node) => boolean)
  | Record<string, unknown>
  | string;

export type SearchOptions = {
  deep?: boolean;
};

export type JsonNode<Data = Record<string, unknown>> = {
  id: string;
  parentId: string | null;
  data: Data;
  children: Array<JsonNode<Data>>;
};

export type NormalizedData<Data = Record<string, unknown>> = {
  id: string;
  data: Data;
};

export { Node, Tree };
