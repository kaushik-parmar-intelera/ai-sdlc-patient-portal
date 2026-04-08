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

export const getAuthRedirectPath = (pathname: string): string => {
  if (pathname.startsWith("/private")) {
    return "/public";
  }
  return "/";
};
