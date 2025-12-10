import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Package {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  destination: string;
  country: string;
  departureCity: string;
  nights: number;
  includesFlight: boolean;
  includesHotel: boolean;
  includesTransfer: boolean;
  hotelName: string;
  price: number;
  currency: string;
  priceNote: string;
  disclaimer: string;
  paymentLink: string;
  createdAt: Date;
}

interface PackagesContextType {
  packages: Package[];
  addPackage: (pkg: Omit<Package, "id" | "createdAt">) => string;
  deletePackage: (id: string) => void;
  getPackage: (id: string) => Package | undefined;
}

const PackagesContext = createContext<PackagesContextType | undefined>(undefined);

const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};

export const PackagesProvider = ({ children }: { children: ReactNode }) => {
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("viasol_packages");
    if (stored) {
      const parsed = JSON.parse(stored);
      setPackages(parsed.map((pkg: Package) => ({
        ...pkg,
        createdAt: new Date(pkg.createdAt),
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("viasol_packages", JSON.stringify(packages));
  }, [packages]);

  const addPackage = (pkg: Omit<Package, "id" | "createdAt">): string => {
    const id = generateId();
    const newPackage: Package = {
      ...pkg,
      id,
      createdAt: new Date(),
    };
    setPackages((prev) => [newPackage, ...prev]);
    return id;
  };

  const deletePackage = (id: string) => {
    setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
  };

  const getPackage = (id: string) => {
    return packages.find((pkg) => pkg.id === id);
  };

  return (
    <PackagesContext.Provider value={{ packages, addPackage, deletePackage, getPackage }}>
      {children}
    </PackagesContext.Provider>
  );
};

export const usePackages = () => {
  const context = useContext(PackagesContext);
  if (!context) {
    throw new Error("usePackages must be used within a PackagesProvider");
  }
  return context;
};
