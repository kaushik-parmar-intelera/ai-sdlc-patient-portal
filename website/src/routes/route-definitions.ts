export type RouteGroup = "public" | "private";

export interface RouteDefinition {
  id: string;
  path: string;
  group: RouteGroup;
  layout: string;
  preloadPolicy: "eager" | "lazy";
  requiredPermissions: string[];
}

export const routeDefinitions: RouteDefinition[] = [
  // ── Public routes ────────────────────────────────────────
  {
    id: "home",
    path: "/",
    group: "public",
    layout: "root",
    preloadPolicy: "eager",
    requiredPermissions: [],
  },
  {
    id: "login",
    path: "/login",
    group: "public",
    layout: "public",
    preloadPolicy: "lazy",
    requiredPermissions: [],
  },
  {
    id: "register",
    path: "/register",
    group: "public",
    layout: "public",
    preloadPolicy: "lazy",
    requiredPermissions: [],
  },

  // ── Private routes ───────────────────────────────────────
  {
    id: "dashboard",
    path: "/dashboard",
    group: "private",
    layout: "private",
    preloadPolicy: "eager",
    requiredPermissions: ["session:authenticated"],
  },
  {
    id: "profile",
    path: "/profile",
    group: "private",
    layout: "private",
    preloadPolicy: "lazy",
    requiredPermissions: ["session:authenticated"],
  },
  {
    id: "appointments",
    path: "/appointments",
    group: "private",
    layout: "private",
    preloadPolicy: "lazy",
    requiredPermissions: ["session:authenticated"],
  },
  {
    id: "messages",
    path: "/messages",
    group: "private",
    layout: "private",
    preloadPolicy: "lazy",
    requiredPermissions: ["session:authenticated"],
  },
  {
    id: "prescriptions",
    path: "/prescriptions",
    group: "private",
    layout: "private",
    preloadPolicy: "lazy",
    requiredPermissions: ["session:authenticated"],
  },
  {
    id: "lab-results",
    path: "/lab-results",
    group: "private",
    layout: "private",
    preloadPolicy: "lazy",
    requiredPermissions: ["session:authenticated"],
  },
];

export const isPrivatePath = (path: string): boolean =>
  routeDefinitions.some(
    (route) => route.path === path && route.group === "private"
  );
