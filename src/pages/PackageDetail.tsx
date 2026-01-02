import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Plane, Building2, Bus, CreditCard, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoViasol from "@/assets/logo-viasol.svg";
import { FlightInfo } from "@/components/packages/FlightInfo";
import { HotelInfo } from "@/components/packages/HotelInfo";
import { TransferInfo } from "@/components/packages/TransferInfo";
import { MediaGallery } from "@/components/packages/MediaGallery";

interface PackageData {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  destination: string;
  country: string;
  departure_city: string;
  nights: number;
  
  includes_flight: boolean;
  includes_hotel: boolean;
  includes_transfer: boolean;
  
  // Hotel Details (Snake Case from DB)
  hotel_name: string | null;
  room_type: string | null;
  meal_plan: string | null;
  media_urls: string[] | null;

  // Flight Details (Snake Case from DB)
  airline: string | null;
  departure_airport: string | null;
  arrival_airport: string | null;
  outbound_departure_time: string | null;
  outbound_arrival_time: string | null;
  return_departure_time: string | null;
  return_arrival_time: string | null;

  price: number;
  currency: string;
  price_note: string | null;
  disclaimer: string | null;
  payment_link: string | null;
}

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<PackageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      if (!id) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("packages_public")
        .select("*")
        .eq("slug", id)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPkg(data);
      }
      setLoading(false);
    };

    fetchPackage();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-turquoise/10 to-turquoise/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-turquoise/10 to-turquoise/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <img src={logoViasol} alt="Via Sol" className="w-32 h-auto mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-navy mb-2">Paquete no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            Este paquete no existe o ya no está disponible
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: pkg.image_url ? `url(${pkg.image_url})` : 'linear-gradient(180deg, hsl(185 50% 40%) 0%, hsl(185 60% 30%) 100%)'
        }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-turquoise/60 via-turquoise/40 to-navy/80" />
      
      {/* Decorative wave elements */}
      <div className="absolute top-0 left-0 w-64 h-64 opacity-30">
        <svg viewBox="0 0 200 200" className="w-full h-full text-turquoise">
          <path
            fill="currentColor"
            d="M40,-50C52.3,-40.8,63,-28.3,67.5,-13.4C72,1.5,70.3,18.8,62.3,32.3C54.3,45.8,40,55.5,24.3,60.5C8.5,65.5,-8.8,65.8,-24.3,60.2C-39.8,54.5,-53.5,42.8,-61.2,28C-68.8,13.2,-70.3,-4.8,-65.7,-21.3C-61,-37.8,-50.2,-52.8,-36.5,-61.5C-22.8,-70.2,-6,-72.5,8.2,-68.3C22.3,-64.2,27.7,-59.2,40,-50Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
          {/* Main Title - ESCAPADA or VACACIONES based on nights */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-black text-white drop-shadow-lg mb-1"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", letterSpacing: '0.05em' }}
            >
              {pkg.nights <= 5 ? "ESCAPADA" : "VACACIONES"}
            </motion.h1>
            
            {/* "en" text */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="text-white/80 text-lg mb-2" 
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              en
            </motion.p>
            
            {/* Destination - Light pink color from logo */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-2"
            >
              <span 
                className="inline-block px-6 py-2 bg-navy/80 text-2xl md:text-3xl font-bold rounded-lg" 
                style={{ color: 'hsl(4, 60%, 75%)' }}
              >
                {pkg.destination.toUpperCase()}
              </span>
            </motion.div>
            
            {/* Departure City */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/90 text-sm tracking-widest mb-2"
            >
              SALIDA DESDE {pkg.departure_city.toUpperCase()}
            </motion.p>
            
            {/* Country */}
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-white mb-1" 
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif" }}
            >
              {pkg.country.toUpperCase()}
            </motion.h2>
            
            {/* Nights */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-golden mb-6"
            >
              {pkg.nights} NOCHES
            </motion.p>
            
            {/* Includes Section - UPDATED WITH FLIGHT/HOTEL INFO COMPONENTS */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-4"
            >
              <p className="text-white text-lg font-semibold tracking-widest mb-3">INCLUYE</p>
              <div className="flex items-center justify-center gap-4">
                
                {/* 1. FLIGHT */}
                {pkg.includes_flight && (
                  <FlightInfo 
                    airline={pkg.airline}
                    departureAirport={pkg.departure_airport}
                    arrivalAirport={pkg.arrival_airport}
                    outboundDepartureTime={pkg.outbound_departure_time}
                    outboundArrivalTime={pkg.outbound_arrival_time}
                    returnDepartureTime={pkg.return_departure_time}
                    returnArrivalTime={pkg.return_arrival_time}
                  />
                )}

                {pkg.includes_flight && pkg.includes_hotel && (
                  <span className="text-white text-2xl font-bold">+</span>
                )}

                {/* 2. HOTEL */}
                {pkg.includes_hotel && (
                    <HotelInfo 
                        hotelName={pkg.hotel_name}
                        roomType={pkg.room_type}
                        mealPlan={pkg.meal_plan}
                        nights={pkg.nights}
                    />
                )}

                {pkg.includes_hotel && pkg.includes_transfer && (
                  <span className="text-white text-2xl font-bold">+</span>
                )}

                {/* 3. TRANSFER */}
                {pkg.includes_transfer && (
                  <TransferInfo />
                )}
              </div>
            </motion.div>
            
            {/* Hotel Name (Still showing this text below the icons as a secondary confirmation) */}
            {pkg.hotel_name && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-white/90 text-sm tracking-wider mb-4"
              >
                {pkg.hotel_name.toUpperCase()}
              </motion.p>
            )}
            
            {/* Price */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.9 }}
              className="mb-2"
            >
              <p className="text-white/80 text-sm">Desde</p>
              <p className="text-4xl md:text-5xl font-black text-golden">
                {pkg.currency} {Number(pkg.price).toLocaleString()}
              </p>
            </motion.div>
            
            {/* Price Note */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-white/90 text-sm font-semibold tracking-wider mb-6"
            >
              {pkg.price_note || "TARIFA POR PERSONA, BASE DBL"}
            </motion.p>
            
            {/* Payment Button */}
            {pkg.payment_link ? (
              <motion.a 
                href={pkg.payment_link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-golden text-navy font-bold text-lg rounded-full shadow-lg hover:bg-golden/90 transition-all"
              >
                <CreditCard className="w-5 h-5" />
                Reservar ahora
              </motion.a>
            ) : (
              <motion.button
                onClick={() => copyAlias("viasol.agencia")} // Alias hardcodeado
                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white font-bold text-lg rounded-full shadow-lg"
              >
                <Copy className="w-5 h-5" />
                Pagar por transferencia
              </motion.button>
            )}

          </motion.div>
        </main>
        
        <div className="w-full bg-slate-50 py-12">
        {pkg.media_urls && pkg.media_urls.length > 0 && (
          <MediaGallery mediaUrls={pkg.media_urls} />
        )}
        </div>
        
        {/* Footer with disclaimer */}
        {pkg.disclaimer && (
          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="p-4 text-center"
          >
            <p className="text-white/70 text-xs max-w-lg mx-auto leading-relaxed">
              {pkg.disclaimer}
            </p>
          </motion.footer>
        )}
      </div>

      <motion.a
        href={`https://wa.me/5491127548959?text=${encodeURIComponent(
          `Hola! Vi el paquete "${pkg.title}" en la web y me gustaría recibir más información.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full shadow-xl cursor-pointer"
        style={{ backgroundColor: '#25D366' }} // Official WhatsApp Green
        title="Consultar por WhatsApp"
      >
        {/* WhatsApp Icon SVG (White) */}
        <svg 
          viewBox="0 0 24 24" 
          fill="white" 
          className="w-9 h-9"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      </motion.a>
    </div>
  );
};

export default PackageDetail;
