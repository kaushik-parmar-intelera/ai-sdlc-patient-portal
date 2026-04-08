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
  {
    id: "home",
    path: "/",
    group: "public",
    layout: "root",
    preloadPolicy: "eager",
    requiredPermissions: [],
  },
  {
    id: "public-home",
    path: "/public",
    group: "public",
    layout: "public",
    preloadPolicy: "lazy",
    requiredPermissions: [],
  },
  {
    id: "private-home",
    path: "/private",
    group: "private",
    layout: "private",
    preloadPolicy: "lazy",
    requiredPermissions: ["session:authenticated"],
  },
];

export const isPrivatePath = (path: string): boolean =>
  routeDefinitions.some((route) => route.path === path && route.group === "private");
