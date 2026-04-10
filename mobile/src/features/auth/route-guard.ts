export function getProtectedRedirectPath(isAuthenticated: boolean): "/login" | null {
  return isAuthenticated ? null : "/login";
}

export function getEntryRoute(isAuthenticated: boolean): "/home" | "/login" {
  return isAuthenticated ? "/home" : "/login";
}
