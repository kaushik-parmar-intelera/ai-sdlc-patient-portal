import { authenticateWithDemoAccount } from "../../../mobile/src/features/auth/auth-service";
import { useAuthStore } from "../../../mobile/src/store/auth-store";

describe("auth store", () => {
  beforeEach(() => {
    useAuthStore.getState().signOut();
  });

  it("accepts the shared demo account", () => {
    const result = authenticateWithDemoAccount({
      username: "patientdemo",
      password: "Care@123",
    });

    expect(result?.displayName).toBe("Vansh Demo");
  });

  it("stores authenticated state after sign in", () => {
    useAuthStore.getState().signIn({
      displayName: "Vansh Demo",
      username: "patientdemo",
      password: "Care@123",
    });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().account?.username).toBe("patientdemo");
  });
});
