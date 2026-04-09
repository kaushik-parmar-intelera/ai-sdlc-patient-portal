import fs from "node:fs";
import path from "node:path";

describe("US2 CI quality gate configuration", () => {
  it("keeps validate script wired to lint/typecheck/test/build", () => {
    const packageJsonPath = path.resolve(process.cwd(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as {
      scripts: Record<string, string>;
    };
    const validateScriptPath = path.resolve(process.cwd(), "scripts/validate.mjs");
    const validateScript = fs.readFileSync(validateScriptPath, "utf8");

    expect(packageJson.scripts.validate).toBe("node scripts/validate.mjs");
    expect(validateScript).toContain('["npm", ["run", "lint"]]');
    expect(validateScript).toContain('["npm", ["run", "typecheck"]]');
    expect(validateScript).toContain('["npm", ["run", "test"]]');
    expect(validateScript).toContain('["npm", ["run", "build"]]');
  });

  it("defines CI workflow steps for lint, typecheck, test, build, and coverage artifact", () => {
    const workflowPath = path.resolve(process.cwd(), "../.github/workflows/website-quality.yml");
    const workflow = fs.readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("pnpm run lint");
    expect(workflow).toContain("pnpm run typecheck");
    expect(workflow).toContain("pnpm run test:coverage");
    expect(workflow).toContain("pnpm run build");
    expect(workflow).toContain("actions/upload-artifact@v5");
  });
});
