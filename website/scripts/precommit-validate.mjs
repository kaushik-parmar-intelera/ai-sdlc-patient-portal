#!/usr/bin/env node
/* global process */
import { runValidate } from "./validate.mjs";

export const runPrecommitValidate = ({ runner = runValidate } = {}) => runner();

if (process.env.NODE_ENV !== "test") {
  const status = runPrecommitValidate();
  if (status !== 0) {
    process.exit(status);
  }
}
