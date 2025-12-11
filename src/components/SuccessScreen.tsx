import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MessageCircle, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface FormData {
  telefono: string;
  adultos: number;
  menores: number;
  fechaPreferencia: "fecha" | "mes" | "sin_preferencia";
  fechaInicio?: Date;
  fechaFin?: Date;
  mes?: string;
  destino: string;
}

interface SuccessScreenProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData | null;
}

const SuccessScreen = ({ isOpen, onClose, formData }: SuccessScreenProps) => {
  if (!formData) return null;

  const getDateText = () => {
    if (formData.fechaPreferencia === "sin_preferencia") {
      return "Sin preferencia";
    }
    if (formData.fechaPreferencia === "mes" && formData.mes) {
      return formData.mes;
    }
    if (formData.fechaPreferencia === "fecha" && formData.fechaInicio) {
      if (formData.fechaFin) {
        return `${format(formData.fechaInicio, "dd MMM", { locale: es })} - ${format(formData.fechaFin, "dd MMM yyyy", { locale: es })}`;
      }
      return format(formData.fechaInicio, "PPP", { locale: es });
    }
    return "Por definir";
  };

  const whatsappMessage = encodeURIComponent(
    `Hola! Me gustaría cotizar un paquete:\n📱 Teléfono: ${formData.telefono}\n👥 Viajeros: ${formData.adultos} adultos, ${formData.menores} menores\n📅 Fecha: ${getDateText()}\n🌍 Destino: ${formData.destino}\n\n¡Gracias!`
  );

  const whatsappUrl = `https://wa.me/5491112345678?text=${whatsappMessage}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Success animation */}
            <div className="pt-12 pb-6 px-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15 }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", damping: 15 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </motion.div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-navy mb-2"
              >
                ¡Solicitud enviada!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-6"
              >
                Nos pondremos en contacto contigo muy pronto para armar tu viaje ideal.
              </motion.p>
            </div>

            {/* Summary card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mx-6 p-4 rounded-2xl bg-muted/50 mb-6"
            >
              <h3 className="font-semibold text-navy mb-3">Resumen de tu solicitud</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Destino:</span>
                  <span className="font-medium text-navy">{formData.destino}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Viajeros:</span>
                  <span className="font-medium text-navy">
                    {formData.adultos} adultos, {formData.menores} menores
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha:</span>
                  <span className="font-medium text-navy">{getDateText()}</span>
                </div>
              </div>
            </motion.div>

            {/* WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 pt-0"
            >
              <p className="text-sm text-muted-foreground text-center mb-4">
                ¿Querés agilizar tu consulta?
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-full font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95"
                style={{ background: '#25D366' }}
              >
                <MessageCircle className="w-5 h-5" />
                Contactar por WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessScreen;
