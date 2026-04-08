import path from "node:path";
import { pathToFileURL } from "node:url";

interface ValidateModule {
  runValidate: (options?: {
    commands?: Array<[string, string[]]>;
    spawn?: (bin: string, args: string[], options: unknown) => { status: number | null; error?: Error };
  }) => number;
}

interface PrecommitModule {
  runPrecommitValidate: (options?: { runner?: () => number }) => number;
}

const importFreshModule = async <T>(modulePath: string): Promise<T> => {
  const fileUrl = pathToFileURL(modulePath).href;
  return (await import(`${fileUrl}?cacheBust=${Date.now()}`)) as T;
};

describe("US2 validation script orchestration", () => {
  it("runs lint, typecheck, test, and build in order", async () => {
    const modulePath = path.resolve(process.cwd(), "scripts/validate.mjs");
    const validateModule = await importFreshModule<ValidateModule>(modulePath);
    const executedCommands: string[] = [];

    const status = validateModule.runValidate({
      spawn: ((bin: string, args: string[]) => {
        executedCommands.push(`${bin} ${args.join(" ")}`);
        return { status: 0 };
      }) as ValidateModule["runValidate"] extends (options?: infer T) => number
        ? NonNullable<T>["spawn"]
        : never,
    });

    expect(status).toBe(0);
    expect(executedCommands).toEqual([
      "npm run lint",
      "npm run typecheck",
      "npm run test",
      "npm run build",
    ]);
  });

  it("halts on first non-zero exit code", async () => {
    const modulePath = path.resolve(process.cwd(), "scripts/validate.mjs");
    const validateModule = await importFreshModule<ValidateModule>(modulePath);

    let callCount = 0;
    const status = validateModule.runValidate({
      spawn: ((_: string, __: string[]) => {
        callCount += 1;
        return callCount === 3 ? { status: 2 } : { status: 0 };
      }) as ValidateModule["runValidate"] extends (options?: infer T) => number
        ? NonNullable<T>["spawn"]
        : never,
    });

    expect(status).toBe(2);
    expect(callCount).toBe(3);
  });

  it("precommit runner delegates to shared validate workflow", async () => {
    const modulePath = path.resolve(process.cwd(), "scripts/precommit-validate.mjs");
    const precommitModule = await importFreshModule<PrecommitModule>(modulePath);
    const runner = jest.fn(() => 0);

    const status = precommitModule.runPrecommitValidate({ runner });

    expect(status).toBe(0);
    expect(runner).toHaveBeenCalledTimes(1);
  });
});
