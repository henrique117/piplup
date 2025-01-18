"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function escapeFormatting(input) {
    return input
        .replace(/_/g, '\\_')
        .replace(/\*/g, '\\*')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`');
}
exports.default = escapeFormatting;
