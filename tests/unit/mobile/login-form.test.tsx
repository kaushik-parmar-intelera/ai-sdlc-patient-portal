import { loginSchema } from "../../../mobile/src/features/auth/login-form";

describe("login form schema", () => {
  it("requires username and password", () => {
    const result = loginSchema.safeParse({ username: "", password: "" });

    expect(result.success).toBe(false);
  });

  it("accepts a non-empty username and password", () => {
    const result = loginSchema.safeParse({ username: "patientdemo", password: "Care@123" });

    expect(result.success).toBe(true);
  });
});
