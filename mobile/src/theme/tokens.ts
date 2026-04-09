export const colors = {
  cream: "#F6F0E8",
  creamMuted: "rgba(246, 240, 232, 0.78)",
  background: "#F4EFE7",
  surface: "#FFFDF9",
  surfaceMuted: "#E8F0EC",
  deepTeal: "#0F4C5C",
  teal: "#197278",
  tealDark: "#0B3D4A",
  mint: "#7CC6B3",
  gold: "#E5A54B",
  coral: "#D56F52",
  ink: "#17313A",
  muted: "#5B6E75",
  border: "#D5E1DD",
  error: "#B94D3D",
  overlay: "rgba(255,255,255,0.16)",
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
};

export const radii = {
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
};

export const typography = {
  display: {
    fontSize: 34,
    fontWeight: "700" as const,
  },
  title: {
    fontSize: 26,
    fontWeight: "700" as const,
  },
  titleSmall: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
  },
  overline: {
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 1.2,
  },
};

export const shadows = {
  card: {
    shadowColor: "#0F4C5C",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 6,
  },
};
