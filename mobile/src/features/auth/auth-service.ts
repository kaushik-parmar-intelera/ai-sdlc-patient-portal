import { DEMO_ACCOUNT } from "../../constants/auth";
import type { DemoAccount } from "../../types/auth";

type LoginAttempt = {
  password: string;
  username: string;
};

export function authenticateWithDemoAccount(values: LoginAttempt): DemoAccount | null {
  if (values.username === DEMO_ACCOUNT.username && values.password === DEMO_ACCOUNT.password) {
    return DEMO_ACCOUNT;
  }

  return null;
}
