# Treesy - An API for creating and manipulating tree-node structures

This library is meant to be used for creating and manipulating tree-node structures.

The API is designed with ease of use in mind, hence the name Treesy (Tree + Easy - get it? 😂 - I'm sorry).

I created it for a side project I'm working on because I couldn't find a library that has a simple API and is "just" for creating tree structures. Oh and it doesn't have any dependencies :)

> Warning! The API is not final and is most likely to change!

## Installation

```
yarn add treesy
```

```
npm install treesy
```

Or through a CDN

```html
<script src="https://unpkg.com/treesy"></script>
```

## Usage

#### Basic usage

```ts
import { Tree } from "treesy";

const tree = new Tree();

tree.add({ name: "bob" });

console.log(tree.toJson());
```

```json
[
  {
    "id": "UUID",
    "parentId": null,
    "data": {
      "name": "bob"
    },
    "children": []
  }
]
```

#### Change the ID

```ts
tree.add("MY_UNIQUE_ID", { name: "bob" });

console.log(tree.toJSON());
```

```json
[
  {
    "id": "MY_UNIQUE_ID",
    "parentId": null,
    "data": {
      "name": "bob"
    },
    "children": []
  }
]
```

## API

### Tree

#### add | (idOrData: string | AddData, data?: Data): Node

This is used to add a root node.

#### find | (criteria: SearchCriteria, options?: SearchOptions, node?: Node): Node | undefined

Used to search the whole tree for a given node based on the search criteria.

`SearchCriteria` - There are 3 possible ways to use the search criteria.

- By specifying a string which will look for a node by its ID.
- By passing an object which will look at the `data` property of the Node. It does a `subset` comparison therefore the whole `data` object doesn't have to match exactly, only a subset of the fields.
- By a callback if you wanted more control. The callback needs to return a boolean and the first argument of the callback is the `current` node.

The callback can be used like this:

```ts
const node = tree.find((node) => {
  if (node.data.count === 2) {
    return true;
  }
});
```

`SearchOptions` - possible options include:

```ts
export type SearchOptions = {
  deep?: boolean;
};
```

If `deep` is set to tree, the finder will do a recursive search. If it's false, it'll only look at the direct children of the tree (root nodes).

`Node` - Used to set the "from" point on the search. If a node is passed, it'll start the search from there and search its children only.

#### toJson | (): JsonNode[]

Generates a JSON representation of the tree.

### Node

#### id: string

Return the ID of the node

#### parentId: string | null

Return the parent ID of the node. Can be null if it's a root node or if it's not part of a tree object yet.

#### data: Record<string, unknown>;

Data object of the node. Can be used to store anything such as state.

#### children: Array<Node>

Node's children.

#### tree: Tree

The tree itself. This can be a quick way to access the methods on the tree object.

#### parent: Node | undefined

Return the direct parent of a given Node.

#### add | (idOrData: string | AddData, data?: Data): Node

Same as the `add` method on the [Tree](#tree) but this time, you are adding a new node as a child of the current node.

#### find | (criteria: SearchCriteria, options?: SearchOptions): Node | undefined

Same as the `find` method on the [Tree](#tree) but without the `Node` argument.

#### update | (dataToUpdate: Record<string, unknown>): Node

Changes the `data` object of the current Node. This method overrides the current `data` object so make sure you use something like `Object.assign` if you don't want to lose any data.

#### move | (criteria: SearchCriteria, index?: number): Node | undefined

This method can be used if you want to move the current node somewhere else in the tree. `criteria` works exactly the same as `find` but this time, you want to use this to find the `target` node - so the node that you want your `current` node to be a child of. If you wanted to move it to the `root` of the tree, you can pass `root` as the `criteria` (Note: this is not possible on the `find` method).

By default, the moved node is added at the bottom of the children but if you wanted to target a specific index in the children's array, you can pass it as the second argument.

This can be used like this:

```ts
const rootNode = tree.add({ greeting: "hello" });
const childNode = rootNode.add({ greeting: "hi" });

childNode.move("root");
```

#### remove | (): void

Can be used to remove the node completely.

```ts
const rootNode = tree.add({ greeting: "hello" });

rootNode.remove();
```

#### toJson | (): JsonNode[]

Generates a JSON representation of the node and it's children.

## TODO

- [ ] Allow creating a tree with default data
- [ ] Write tests and have 100% coverage
