import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

const plugins = [resolve(), typescript(), cjs()];

if (process.env.NODE_ENV === "production") {
  plugins.push(terser({ keep_classnames: true }));
}

export default [
  {
    input: "src/index.ts",
    plugins,
    output: [
      {
        file: "dist/index.js",
        format: "cjs",
      },
      {
        file: "dist/index.es.js",
        format: "esm",
        exports: "named",
      },
      {
        name: "Treesy",
        file: "dist/index.iife.js",
        format: "iife",
      },
    ],
  },
  {
    input: "src/types.ts",
    output: [{ dir: "dist", format: "es" }],
    plugins: [dts()],
  },
];
