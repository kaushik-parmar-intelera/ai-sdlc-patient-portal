// Stitch Design System – "The Serene Clinical Interface"
// Source: project 12210324048331832562 (Remix of Mobile - Patient Auth & Profile)

export const colors = {
  // Surface hierarchy (no borders – use color shifts for depth)
  surface: "#F8F9FC",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F2F3F6",
  surfaceContainer: "#EDEEF1",
  surfaceContainerHigh: "#E7E8EB",
  surfaceContainerHighest: "#E1E2E5",
  surfaceDim: "#D9DADD",

  // Primary – pastel steel blue
  primary: "#42617D",
  primaryContainer: "#A8C8E8",
  onPrimary: "#FFFFFF",
  onPrimaryContainer: "#34546F",
  primaryFixed: "#CDE5FF",
  primaryFixedDim: "#AACAEA",

  // On-surface text
  onSurface: "#191C1E",
  onSurfaceVariant: "#42474D",

  // Secondary – soft lavender
  secondary: "#655978",
  secondaryContainer: "#E9D9FF",
  secondaryFixedDim: "#CFC0E5",

  // Error
  error: "#BA1A1A",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#93000A",

  // Outline
  outline: "#73777E",
  outlineVariant: "#C2C7CE",

  // Tertiary – warm amber
  tertiary: "#7C572D",
  tertiaryContainer: "#ECBB89",

  // Inverse
  inverseOnSurface: "#F0F1F4",
  inverseSurface: "#2E3133",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 32,
  pill: 999,
};

export const typography = {
  display: {
    fontSize: 32,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
  },
  headlineLg: {
    fontSize: 24,
    fontWeight: "600" as const,
    letterSpacing: -0.3,
  },
  titleMd: {
    fontSize: 18,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500" as const,
  },
  labelSm: {
    fontSize: 11,
    fontWeight: "600" as const,
    letterSpacing: 0.8,
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
  },
};

export const shadows = {
  card: {
    shadowColor: "#191C1E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 3,
  },
  nav: {
    shadowColor: "#191C1E",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 8,
  },
  float: {
    shadowColor: "#191C1E",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 6,
  },
};
