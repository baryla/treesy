import { Tree } from "./Tree";
import { Node } from "./Node";

export type AddData<NodeData = unknown> = {
  id?: string;
} & NodeData;

export type Data = Record<string, unknown>;

export type SearchCriteria =
  | ((node: Node) => boolean)
  | Record<string, unknown>
  | string;

export type SearchOptions = {
  deep?: boolean;
};

export type JsonNode<Data = unknown> = {
  id: string;
  parentId: string | null;
  data: Data;
  children: Array<JsonNode<Data>>;
};

export type NormalizedData<Data = unknown> = {
  id: string;
  data: Data;
};

export { Node, Tree };
