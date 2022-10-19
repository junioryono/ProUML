import { describe, expect, test } from "@jest/globals";
import Parser from "./javatojson";
import SnakeGame from "./SnakeGame";

describe("Parser", () => {
  describe("java to json", () => {
    test("snake game to json", () => {
      const parser = new Parser(SnakeGame);
      parser.parseFiles();
      const parsedFiles = parser.getParsedFiles();

      expect(parsedFiles).toHaveLength(6);
    });
  });
});
