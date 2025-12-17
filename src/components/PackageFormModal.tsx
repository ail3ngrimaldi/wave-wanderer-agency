import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Users, Calendar, MapPin, Phone, Loader2, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

const formSchema = z.object({
  telefono: z.string().min(8, "Ingresa un número válido").max(20, "Número demasiado largo"),
  adultos: z.number().min(1, "Mínimo 1 adulto").max(20),
  menores: z.number().min(0).max(20),
  fechaPreferencia: z.enum(["fecha", "mes", "sin_preferencia"]),
  fechaInicio: z.date().optional(),
  fechaFin: z.date().optional(),
  mes: z.string().optional(),
  destino: z.string().min(1, "Selecciona un destino"),
});

type FormData = z.infer<typeof formSchema>;

interface PackageFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: FormData) => void;
}

const destinations = {
  "Argentina": ["Bariloche", "Córdoba", "Corrientes", "El Calafate", "Jujuy", "Mendoza", "Neuquén", "Posadas", "Puerto Iguazú", "Salta", "San Juan", "Santiago del Estero", "Tucumán", "Ushuaia"],
  "Brasil": ["Nordeste", "Rio de Janeiro", "Florianópolis"],
};

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const PackageFormModal = ({ isOpen, onClose, onSuccess }: PackageFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adultos, setAdultos] = useState(1);
  const [menores, setMenores] = useState(0);
  const [fechaPreferencia, setFechaPreferencia] = useState<"fecha" | "mes" | "sin_preferencia">("fecha");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      adultos: 1,
      menores: 0,
      fechaPreferencia: "fecha",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    const formData = {
      ...data,
      adultos,
      menores,
      fechaPreferencia,
      fechaInicio: dateRange?.from,
      fechaFin: dateRange?.to,
      mes: selectedMonth,
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Form submitted:", formData);
    onSuccess(formData);
    setIsSubmitting(false);
    reset();
    setAdultos(1);
    setMenores(0);
    setDateRange(undefined);
    setSelectedMonth("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-card/95 backdrop-blur-sm rounded-t-3xl">
              <h2 className="text-2xl font-bold text-navy">Tu viaje ideal</h2>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Teléfono */}
              <div>
                <label className="label-text flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Teléfono de contacto
                </label>
                <input
                  {...register("telefono")}
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  className="input-field"
                />
                {errors.telefono && (
                  <p className="mt-1 text-sm text-destructive">{errors.telefono.message}</p>
                )}
              </div>

              {/* Viajeros */}
              <div>
                <label className="label-text flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Viajeros
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Adultos */}
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-2">Adultos</p>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setAdultos(Math.max(1, adultos - 1))}
                        className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-semibold text-navy">{adultos}</span>
                      <button
                        type="button"
                        onClick={() => setAdultos(Math.min(20, adultos + 1))}
                        className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Menores */}
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-2">Menores</p>
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setMenores(Math.max(0, menores - 1))}
                        className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-semibold text-navy">{menores}</span>
                      <button
                        type="button"
                        onClick={() => setMenores(Math.min(20, menores + 1))}
                        className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fecha */}
              <div>
                <label className="label-text flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Fecha del viaje
                </label>
                
                {/* Preference options */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {[
                    { value: "fecha", label: "Fecha exacta" },
                    { value: "mes", label: "Solo mes" },
                    { value: "sin_preferencia", label: "Sin preferencia" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFechaPreferencia(option.value as typeof fechaPreferencia)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all",
                        fechaPreferencia === option.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                {/* Date range picker */}
                {fechaPreferencia === "fecha" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "input-field text-left flex items-center justify-between",
                          !dateRange?.from && "text-muted-foreground"
                        )}
                      >
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "dd MMM", { locale: es })} - {format(dateRange.to, "dd MMM yyyy", { locale: es })}
                            </>
                          ) : (
                            format(dateRange.from, "PPP", { locale: es })
                          )
                        ) : (
                          "Selecciona fechas de inicio y fin"
                        )}
                        <Calendar className="w-4 h-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card" align="start">
                      <CalendarComponent
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        disabled={(date) => date < new Date()}
                        numberOfMonths={2}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {/* Month selector */}
                {fechaPreferencia === "mes" && (
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="input-field">
                      <SelectValue placeholder="Selecciona un mes" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      {months.map((month, index) => (
                        <SelectItem key={month} value={`${month} 2025`}>
                          {month} 2025
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {fechaPreferencia === "sin_preferencia" && (
                  <p className="text-sm text-muted-foreground p-3 rounded-xl bg-muted/50">
                    Te contactaremos para definir las mejores fechas disponibles.
                  </p>
                )}
              </div>

              {/* Destino */}
              <div>
                <label className="label-text flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Destino
                </label>
                <Select onValueChange={(value) => setValue("destino", value)}>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="¿A dónde querés viajar?" />
                  </SelectTrigger>
                  <SelectContent className="bg-card max-h-[300px]">
                    {Object.entries(destinations).map(([category, items]) => (
                      <div key={category}>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {category}
                        </div>
                        {items.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                {errors.destino && (
                  <p className="mt-1 text-sm text-destructive">{errors.destino.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-cta w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar solicitud"
                  )}
                </span>
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PackageFormModal;
