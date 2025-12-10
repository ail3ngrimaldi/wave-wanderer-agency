import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plane, Building2, Bus, CreditCard } from "lucide-react";
import { usePackages } from "@/contexts/PackagesContext";
import logoViasol from "@/assets/logo-viasol.svg";

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getPackage } = usePackages();
  
  const pkg = id ? getPackage(id) : undefined;

  if (!pkg) {
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
          backgroundImage: pkg.imageUrl ? `url(${pkg.imageUrl})` : 'linear-gradient(180deg, hsl(185 50% 40%) 0%, hsl(185 60% 30%) 100%)'
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
            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-black text-white drop-shadow-lg mb-4"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", letterSpacing: '0.05em' }}
            >
              ¡DISFRUTA!
            </motion.h1>
            
            {/* Destination */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-2"
            >
              <span className="inline-block px-6 py-2 bg-navy/80 text-white text-2xl md:text-3xl font-bold rounded-lg">
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
              SALIDA DESDE {pkg.departureCity.toUpperCase()}
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
            
            {/* Includes Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-4"
            >
              <p className="text-white text-lg font-semibold tracking-widest mb-3">INCLUYE</p>
              <div className="flex items-center justify-center gap-4">
                {pkg.includesFlight && (
                  <div className="w-14 h-14 rounded-full bg-turquoise flex items-center justify-center">
                    <Plane className="w-7 h-7 text-white" />
                  </div>
                )}
                {pkg.includesFlight && pkg.includesHotel && (
                  <span className="text-white text-2xl font-bold">+</span>
                )}
                {pkg.includesHotel && (
                  <div className="w-14 h-14 rounded-full bg-turquoise flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                )}
                {pkg.includesHotel && pkg.includesTransfer && (
                  <span className="text-white text-2xl font-bold">+</span>
                )}
                {pkg.includesTransfer && (
                  <div className="w-14 h-14 rounded-full bg-turquoise flex items-center justify-center">
                    <Bus className="w-7 h-7 text-white" />
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Hotel Name */}
            {pkg.hotelName && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-white/90 text-sm tracking-wider mb-4"
              >
                {pkg.hotelName.toUpperCase()}
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
                {pkg.currency} {pkg.price.toLocaleString()}
              </p>
            </motion.div>
            
            {/* Price Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-white/90 text-sm font-semibold tracking-wider mb-6"
            >
              {pkg.priceNote || "TARIFA POR PERSONA, BASE DBL"}
            </motion.p>
            
            {/* Payment Button */}
            {pkg.paymentLink && (
              <motion.a
                href={pkg.paymentLink}
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
            )}
          </motion.div>
        </main>
        
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
    </div>
  );
};

export default PackageDetail;
