import homeDataRaw from "@/mocks/screens/home.json";

interface MockScreenDataset {
  screenId: string;
  version: string;
  source: "manual" | "generated" | "copied-from-api";
  payload: Record<string, unknown>;
}

const homeData = homeDataRaw as MockScreenDataset;

const datasetSchemaGuard = (input: unknown): input is MockScreenDataset => {
  if (typeof input !== "object" || input === null) {
    return false;
  }
  const data = input as Partial<MockScreenDataset>;
  const validSources: readonly string[] = ["manual", "generated", "copied-from-api"];
  return (
    typeof data.screenId === "string" &&
    typeof data.version === "string" &&
    typeof data.source === "string" &&
    validSources.includes(data.source) &&
    typeof data.payload === "object" &&
    data.payload !== null
  );
};

export const mockScreenRegistry: Record<string, MockScreenDataset> = {
  home: homeData,
};

export const getMockScreen = (screenId: string): MockScreenDataset => {
  const selected = mockScreenRegistry[screenId];
  if (!datasetSchemaGuard(selected)) {
    throw new Error(`Invalid mock data contract for screen ${screenId}`);
  }
  return selected;
};
