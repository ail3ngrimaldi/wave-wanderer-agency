import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import AnimatedWaves from "@/components/AnimatedWaves";
import PackageFormModal from "@/components/PackageFormModal";
import SuccessScreen from "@/components/SuccessScreen";
import logoViasol from "@/assets/logo-viasol.svg";

interface FormData {
  telefono: string;
  adultos: number;
  menores: number;
  fechaPreferencia: "fecha" | "mes" | "sin_preferencia";
  fecha?: Date;
  mes?: string;
  destino: string;
}

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const handleFormSuccess = (data: FormData) => {
    setSubmittedData(data);
    setIsModalOpen(false);
    setIsSuccessOpen(true);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <AnimatedWaves />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.img
            src={logoViasol}
            alt="Via Sol Travel Agency"
            className="w-64 md:w-80 lg:w-96 h-auto drop-shadow-2xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg md:text-xl text-navy/80 text-center mb-10 max-w-md font-medium"
        >
          Tu próxima experiencia comienza acá
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="btn-cta text-base md:text-lg"
        >
          <span>Pedí tu paquete personalizado</span>
        </motion.button>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-12 flex items-center gap-6"
        >
          <motion.a
            href="https://www.instagram.com/viasol.ok/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-navy/70 hover:text-primary transition-colors"
          >
            <Instagram className="w-6 h-6" />
            <span className="font-medium">@viasol.ok</span>
          </motion.a>
          
          <motion.a
            href="https://www.tiktok.com/@viasol.viajes.con"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-navy/70 hover:text-primary transition-colors"
          >
            <FaTiktok className="w-5 h-5" />
            <span className="font-medium">@viasol.viajes.con</span>
          </motion.a>
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 text-center text-navy/60 text-sm"
        >
          <div className="flex items-center justify-center gap-1">
            <span>Organizamos los viajes de</span>
            <a
              href="https://www.instagram.com/familia.viajera.ok/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary font-semibold hover:underline"
            >
              {/* Icon is now size w-4 (16px) to match text-sm (14px) better */}
              <Instagram className="w-4 h-4" /> 
              familia viajera
            </a>
          </div>
        </motion.footer>
      </div>

      {/* Modals */}
      <PackageFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleFormSuccess}
      />
      <SuccessScreen
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        formData={submittedData}
      />
    </div>
  );
};

export default Index;
