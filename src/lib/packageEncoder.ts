import { Package } from "@/contexts/PackagesContext";

export type EncodedPackage = Omit<Package, "id" | "createdAt">;

export const encodePackage = (pkg: EncodedPackage): string => {
  const json = JSON.stringify(pkg);
  return btoa(encodeURIComponent(json));
};

export const decodePackage = (encoded: string): EncodedPackage | null => {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch {
    return null;
  }
};
