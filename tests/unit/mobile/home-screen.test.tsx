import { render, screen } from "@testing-library/react-native";

import HomeScreen from "../../../mobile/app/home";
import { useAuthStore } from "../../../mobile/src/store/auth-store";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

describe("home screen", () => {
  beforeEach(() => {
    useAuthStore.getState().signIn({
      displayName: "Vansh Demo",
      username: "patientdemo",
      password: "Care@123",
    });
  });

  afterEach(() => {
    useAuthStore.getState().signOut();
  });

  it("renders the fixed dashboard dataset", () => {
    render(<HomeScreen />);

    expect(screen.getByText("Upcoming visit")).toBeTruthy();
    expect(screen.getByText("Tue 10:30 AM")).toBeTruthy();
    expect(screen.getByText("View labs")).toBeTruthy();
  });
});
