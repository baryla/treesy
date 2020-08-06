/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/ban-ts-comment */

const fs = require("fs");
const path = require("path");

const levels = 5;
const rootNodes = 10;
const maxNodes = 5;
const minNodes = 2;

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function nodeCount() {
  return Math.floor(Math.random() * maxNodes) + minNodes;
}

let totalNodes = rootNodes;
function generateTree(fileName = "large-json-tree.json") {
  function generateChildren(parentNode, level) {
    const node = generateNode(parentNode.id);
    const count = nodeCount();

    if (level <= levels) {
      totalNodes = totalNodes + count;
    }

    node.children =
      level <= levels
        ? Array(count)
            .fill("_")
            .map((_) => generateChildren(node, level + 1))
        : [];

    return node;
  }

  function generateNode(parentId) {
    const id = uuid();
    return { id, parentId, data: { greeting: id } };
  }

  function getNodes() {
    return Array(rootNodes)
      .fill("_")
      .map((_) => {
        const node = generateNode(null);
        const count = nodeCount();

        totalNodes = totalNodes + count;

        node.children = Array(count)
          .fill("_")
          .map((_) => generateChildren(node, 1));

        return node;
      });
  }

  const fixturePath = path.join(__dirname, `../src/__fixtures__/${fileName}`);

  try {
    const nodes = getNodes();

    fs.writeFileSync(fixturePath, JSON.stringify(nodes), {
      encoding: "utf8",
    });

    console.log(`${totalNodes} nodes created.`);
  } catch (e) {
    console.error("Error creating fixture", e);
  }
}

generateTree();
