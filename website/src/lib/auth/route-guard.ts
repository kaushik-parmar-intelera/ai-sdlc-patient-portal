import { isPrivatePath } from "@/routes/route-definitions";

export interface RouteGuardContext {
  pathname: string;
  isAuthenticated: boolean;
}

export const isAuthorizedForPath = ({ pathname, isAuthenticated }: RouteGuardContext): boolean => {
  if (!isPrivatePath(pathname)) {
    return true;
  }
  return isAuthenticated;
};

export const getAuthRedirectPath = (pathname: string, isAuthenticated: boolean): string => {
  if (isPrivatePath(pathname) && !isAuthenticated) {
    return "/login";
  }
  if ((pathname === "/login" || pathname === "/register") && isAuthenticated) {
    return "/dashboard";
  }
  return pathname;
};
