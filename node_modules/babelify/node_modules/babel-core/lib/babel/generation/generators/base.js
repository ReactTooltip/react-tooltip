"use strict";

exports.File = File;
exports.Program = Program;
exports.BlockStatement = BlockStatement;
exports.__esModule = true;

function File(node, print) {
  print(node.program);
}

function Program(node, print) {
  print.sequence(node.body);
}

function BlockStatement(node, print) {
  if (node.body.length === 0) {
    this.push("{}");
  } else {
    this.push("{");
    this.newline();
    print.sequence(node.body, { indent: true });
    this.removeLast("\n");
    this.rightBrace();
  }
}