import { getEnvironmentProfile } from "@/lib/config/environment-profile";
import { getMockScreen } from "@/mocks/screens";
import { requestJson } from "@/services/api/http-client";

export interface StartupPayload {
  title: string;
  subtitle: string;
  items: string[];
}

export const fetchStartupPayload = async (): Promise<StartupPayload> => {
  const env = getEnvironmentProfile();

  if (env.enableMockMode) {
    const mock = getMockScreen("home");
    const payload = mock.payload as unknown;
    if (
      typeof payload === "object" &&
      payload !== null &&
      "title" in payload &&
      "subtitle" in payload &&
      "items" in payload
    ) {
      return payload as StartupPayload;
    }
    throw new Error("Invalid mock payload structure for startup");
  }

  return requestJson<StartupPayload>(`${env.apiBaseUrl}/startup`, {
    method: "GET",
    authRequired: false,
    operation: "startup.fetch",
  });
};
