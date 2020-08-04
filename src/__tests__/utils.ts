import { assert } from "../utils";

it("should throw if assert condition returns false", () => {
  expect(() => assert(false, "error")).toThrowError();
});

it("shouldn't throw if assert condition returns true", () => {
  expect(() => assert(true, "error")).not.toThrow();
});
