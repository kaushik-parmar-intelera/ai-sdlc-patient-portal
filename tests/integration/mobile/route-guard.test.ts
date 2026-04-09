import { getEntryRoute, getProtectedRedirectPath } from "../../../mobile/src/features/auth/route-guard";

describe("route guard", () => {
  it("sends unauthenticated users to login", () => {
    expect(getProtectedRedirectPath(false)).toBe("/login");
    expect(getEntryRoute(false)).toBe("/login");
  });

  it("allows authenticated users into home", () => {
    expect(getProtectedRedirectPath(true)).toBeNull();
    expect(getEntryRoute(true)).toBe("/home");
  });
});
