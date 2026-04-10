import { DEMO_ACCOUNT } from "../../constants/auth";
import type { DemoAccount } from "../../types/auth";

type LoginAttempt = {
  email: string;
  password: string;
};

export function authenticateWithDemoAccount(values: LoginAttempt): DemoAccount | null {
  if (values.email === DEMO_ACCOUNT.email && values.password === DEMO_ACCOUNT.password) {
    return DEMO_ACCOUNT;
  }
  return null;
}
