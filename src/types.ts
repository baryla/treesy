import { Tree } from "./Tree";
import { Node } from "./Node";

export interface INode {
  add(id: string, options: AddData): Node;
  add(options: AddData): Node;
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

export type JsonNode = {
  id: string;
  parentId: string | null;
  data: Record<string, unknown>;
  children: Array<JsonNode>;
};

export type NormalizedData = {
  id: string;
  data: Record<string, unknown>;
};

export { Node, Tree };
