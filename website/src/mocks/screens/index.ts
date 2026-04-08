import homeData from "@/mocks/screens/home.json";

interface MockScreenDataset {
  screenId: string;
  version: string;
  source: "manual" | "generated" | "copied-from-api";
  payload: Record<string, unknown>;
}

const datasetSchemaGuard = (input: unknown): input is MockScreenDataset => {
  if (typeof input !== "object" || input === null) {
    return false;
  }
  const data = input as Partial<MockScreenDataset>;
  return (
    typeof data.screenId === "string" &&
    typeof data.version === "string" &&
    typeof data.source === "string" &&
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
