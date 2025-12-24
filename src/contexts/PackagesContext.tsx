import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { generatePackageSlug } from "@/utils/slugGenerator";

// We update the interface to include the new fields
export interface Package {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  imageUrl: string | null;
  destination: string;
  country: string;
  departureCity: string;
  nights: number;
  startDate: Date | null;
  endDate: Date | null;
  price: number;
  currency: string;
  priceNote: string | null;
  disclaimer: string | null;
  paymentLink: string | null;
  
  // Inclusions
  includesFlight: boolean;
  includesHotel: boolean;
  includesTransfer: boolean;

  // Hotel Details
  hotelName: string | null;
  roomType: string | null; // New
  mealPlan: string | null; // New

  // Flight Details
  airline: string | null; // New
  departureAirport: string | null; // New
  arrivalAirport: string | null; // New
  outboundDepartureTime: string | null; // New
  outboundArrivalTime: string | null; // New
  returnDepartureTime: string | null; // New
  returnArrivalTime: string | null; // New

  createdAt: Date;
  expiresAt: Date;
}

interface PackagesContextType {
  packages: Package[];
  loading: boolean;
  addPackage: (pkg: Omit<Package, "id" | "createdAt" | "expiresAt">) => Promise<{ id: string; slug: string } | null>;
  deletePackage: (id: string) => Promise<void>;
  getPackage: (id: string) => Promise<Package | null>;
  refreshPackages: () => Promise<void>;
}

const PackagesContext = createContext<PackagesContextType | undefined>(undefined);

export const PackagesProvider = ({ children }: { children: ReactNode }) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPackages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching packages:", error);
      setPackages([]);
    } else {
      setPackages(
        data.map((pkg) => ({
          id: pkg.id,
          slug: pkg.slug,
          title: pkg.title,
          description: pkg.description,
          imageUrl: pkg.image_url,
          destination: pkg.destination,
          country: pkg.country,
          departureCity: pkg.departure_city,
          nights: pkg.nights,
          includesFlight: pkg.includes_flight,
          includesHotel: pkg.includes_hotel,
          includesTransfer: pkg.includes_transfer,
          hotelName: pkg.hotel_name,
          
          // Map new fields from DB (snake_case) to Frontend (camelCase)
          roomType: pkg.room_type,
          mealPlan: pkg.meal_plan,
          airline: pkg.airline,
          departureAirport: pkg.departure_airport,
          arrivalAirport: pkg.arrival_airport,
          outboundDepartureTime: pkg.outbound_departure_time,
          outboundArrivalTime: pkg.outbound_arrival_time,
          returnDepartureTime: pkg.return_departure_time,
          returnArrivalTime: pkg.return_arrival_time,

          price: Number(pkg.price),
          currency: pkg.currency,
          priceNote: pkg.price_note,
          disclaimer: pkg.disclaimer,
          paymentLink: pkg.payment_link,
          startDate: pkg.start_date ? new Date(pkg.start_date) : null,
          endDate: pkg.end_date ? new Date(pkg.end_date) : null,
          createdAt: new Date(pkg.created_at),
          expiresAt: new Date(pkg.expires_at),
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchPackages();
    } else {
      setPackages([]);
      setLoading(false);
    }
  }, [user]);

  const addPackage = async (pkg: Omit<Package, "id" | "createdAt" | "expiresAt">): Promise<{ id: string; slug: string } | null> => {
    const slug = generatePackageSlug(pkg.title);
    // We map Frontend (camelCase) to DB (snake_case)
    const { data, error } = await supabase
      .from("packages")
      .insert({
        slug: slug,
        title: pkg.title,
        description: pkg.description || null,
        image_url: pkg.imageUrl || null,
        destination: pkg.destination,
        country: pkg.country,
        departure_city: pkg.departureCity,
        nights: pkg.nights,
        includes_flight: pkg.includesFlight,
        includes_hotel: pkg.includesHotel,
        includes_transfer: pkg.includesTransfer,
        
        // Hotel
        hotel_name: pkg.hotelName || null,
        room_type: pkg.roomType || null,
        meal_plan: pkg.mealPlan || null,

        // Flight
        airline: pkg.airline || null,
        departure_airport: pkg.departureAirport || null,
        arrival_airport: pkg.arrivalAirport || null,
        outbound_departure_time: pkg.outboundDepartureTime || null,
        outbound_arrival_time: pkg.outboundArrivalTime || null,
        return_departure_time: pkg.returnDepartureTime || null,
        return_arrival_time: pkg.returnArrivalTime || null,

        price: pkg.price,
        currency: pkg.currency,
        price_note: pkg.priceNote || null,
        disclaimer: pkg.disclaimer || null,
        payment_link: pkg.paymentLink || null,
        start_date: pkg.startDate ? pkg.startDate.toISOString().split('T')[0] : null,
        end_date: pkg.endDate ? pkg.endDate.toISOString().split('T')[0] : null,
        created_by: user?.id || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating package:", error);
      return null;
    }

    await fetchPackages();
    return { id: data.id, slug: data.slug };
  };

  const deletePackage = async (id: string) => {
    const { error } = await supabase.from("packages").delete().eq("id", id);

    if (error) {
      console.error("Error deleting package:", error);
      return;
    }

    setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
  };

  const getPackage = async (id: string): Promise<Package | null> => {
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      description: data.description,
      imageUrl: data.image_url,
      destination: data.destination,
      country: data.country,
      departureCity: data.departure_city,
      nights: data.nights,
      includesFlight: data.includes_flight,
      includesHotel: data.includes_hotel,
      includesTransfer: data.includes_transfer,
      hotelName: data.hotel_name,
      
      // New fields
      roomType: data.room_type,
      mealPlan: data.meal_plan,
      airline: data.airline,
      departureAirport: data.departure_airport,
      arrivalAirport: data.arrival_airport,
      outboundDepartureTime: data.outbound_departure_time,
      outboundArrivalTime: data.outbound_arrival_time,
      returnDepartureTime: data.return_departure_time,
      returnArrivalTime: data.return_arrival_time,

      price: Number(data.price),
      currency: data.currency,
      priceNote: data.price_note,
      disclaimer: data.disclaimer,
      paymentLink: data.payment_link,
      startDate: data.start_date ? new Date(data.start_date) : null,
      endDate: data.end_date ? new Date(data.end_date) : null,
      createdAt: new Date(data.created_at),
      expiresAt: new Date(data.expires_at),
    };
  };

  return (
    <PackagesContext.Provider
      value={{ packages, loading, addPackage, deletePackage, getPackage, refreshPackages: fetchPackages }}
    >
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
