import { getMockScreen } from "@/mocks/screens";
import { requestJson } from "@/services/api/http-client";
import { getEnvironmentProfile } from "@/lib/config/environment-profile";

export interface StartupPayload {
  title: string;
  subtitle: string;
  items: string[];
}

export const fetchStartupPayload = async (): Promise<StartupPayload> => {
  const env = getEnvironmentProfile();

  if (env.enableMockMode) {
    const mock = getMockScreen("home");
    return mock.payload as StartupPayload;
  }

  return requestJson<StartupPayload>(`${env.apiBaseUrl}/startup`, {
    method: "GET",
    authRequired: false,
    operation: "startup.fetch",
  });
};
