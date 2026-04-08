#!/usr/bin/env node
import { spawnSync } from "node:child_process";

export const validateCommandPlan = [
  ["npm", ["run", "lint"]],
  ["npm", ["run", "typecheck"]],
  ["npm", ["run", "test"]],
  ["npm", ["run", "build"]],
];

export const runValidate = ({
  commands = validateCommandPlan,
  spawn = spawnSync,
} = {}) => {
  for (const [bin, args] of commands) {
    const result = spawn(bin, args, { stdio: "inherit", shell: true });

    if (result.error) {
      return 1;
    }

    if ((result.status ?? 1) !== 0) {
      return result.status ?? 1;
    }
  }

  return 0;
};

if (process.env.NODE_ENV !== "test") {
  const status = runValidate();
  if (status !== 0) {
    process.exit(status);
  }
}
