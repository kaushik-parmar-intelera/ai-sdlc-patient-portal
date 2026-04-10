import { render, screen } from "@testing-library/react-native";

import LoginScreen from "../../../mobile/app/login";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

describe("login screen", () => {
  it("renders the sign in CTA and demo credentials", () => {
    render(<LoginScreen />);

    expect(screen.getByText("Sign in")).toBeTruthy();
    expect(screen.getByText(/Username: patientdemo/)).toBeTruthy();
    expect(screen.getByText(/Password: Care@123/)).toBeTruthy();
  });
});
