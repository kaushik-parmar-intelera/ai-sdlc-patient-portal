import { render } from "@testing-library/react-native";

import HomeScreen from "../../../mobile/app/home";
import { useAuthStore } from "../../../mobile/src/store/auth-store";

const replace = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    replace: (...args: unknown[]) => replace(...args),
  },
}));

describe("home guard", () => {
  beforeEach(() => {
    replace.mockReset();
    useAuthStore.getState().signOut();
  });

  it("redirects unauthenticated users back to login", () => {
    render(<HomeScreen />);

    expect(replace).toHaveBeenCalledWith("/login");
  });
});
