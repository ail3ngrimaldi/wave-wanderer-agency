import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FormStepIndicator } from './FormStepIndicator';
import { GeneralInfoStep } from './GeneralInfoStep';
import { HotelDetailsStep } from './HotelDetailsStep';
import { FlightDetailsStep } from './FlightDetailsStep';
import { PackageFormData, DEFAULT_FORM_DATA, ExtendedPackage } from '@/types/package';
import { ChevronLeft, ChevronRight, Check, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInDays } from 'date-fns';

const STEPS = [
  { id: 1, title: 'General', description: 'Información básica' },
  { id: 2, title: 'Hotel', description: 'Alojamiento' },
  { id: 3, title: 'Vuelos', description: 'Detalles de vuelo' },
];

interface MultiStepPackageFormProps {
  initialData?: Partial<PackageFormData>;
  onSubmit: (data: any) => Promise<void>; // Changed to Promise to handle loading state
  onCancel: () => void;
  isEditing?: boolean;
}

export function MultiStepPackageForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: MultiStepPackageFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PackageFormData>({
    ...DEFAULT_FORM_DATA,
    ...initialData,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof PackageFormData, string>>>({});

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = differenceInDays(formData.endDate, formData.startDate);
      // Only update if the calculated days are different from current nights
      // and ensuring we don't set negative numbers
      if (days > 0 && days !== formData.nights) {
        setFormData((prev) => ({ ...prev, nights: days }));
        
        // We can notify the user that the nights had been updated but it might be too much.
        // toast({ title: "Noches actualizadas", description: `Se calcularon ${days} noches.` });
      }
    }
  }, [formData.startDate, formData.endDate]);

  const handleChange = useCallback((field: keyof PackageFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof PackageFormData, string>> = {};

    if (step === 0) {
      if (!formData.title.trim()) newErrors.title = 'El título es requerido';
      if (!formData.departureCity.trim()) newErrors.departureCity = 'La ciudad de origen es requerida';
      if (!formData.destination.trim()) newErrors.destination = 'El destino es requerido';
      if (!formData.country.trim()) newErrors.country = 'El país es requerido';
      if (formData.price <= 0) newErrors.price = 'El precio debe ser mayor a 0';
      if (!formData.nights || formData.nights < 1) newErrors.nights = 'Mínimo 1 noche';
    }

    if (step === 1 && formData.includesHotel) {
      if (!formData.hotelName.trim()) newErrors.hotelName = 'El nombre del alojamiento es requerido';
    }

    if (step === 2 && formData.includesFlight) {
      if (!formData.airline.trim()) newErrors.airline = 'La aerolínea es requerida';
      if (!formData.departureAirport.trim()) newErrors.departureAirport = 'El aeropuerto de salida es requerido';
      if (!formData.arrivalAirport.trim()) newErrors.arrivalAirport = 'El aeropuerto de llegada es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    } else {
      toast({
        title: 'Faltan datos',
        description: 'Por favor completa los campos requeridos marcados en rojo.',
        variant: 'destructive',
      });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      toast({
        title: 'Error de validación',
        description: 'Por favor completa los campos requeridos.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Prepare data
    const packageData = {
      ...formData,
      // Ensure specific fields are null if included checkbox is false
      hotelName: formData.includesHotel ? formData.hotelName : null,
      roomType: formData.includesHotel ? formData.roomType : null,
      mealPlan: formData.includesHotel ? formData.mealPlan : null,
      airline: formData.includesFlight ? formData.airline : null,
      departureAirport: formData.includesFlight ? formData.departureAirport : null,
      arrivalAirport: formData.includesFlight ? formData.arrivalAirport : null,
      outboundDepartureTime: formData.includesFlight ? formData.outboundDepartureTime : null,
      outboundArrivalTime: formData.includesFlight ? formData.outboundArrivalTime : null,
      returnDepartureTime: formData.includesFlight ? formData.returnDepartureTime : null,
      returnArrivalTime: formData.includesFlight ? formData.returnArrivalTime : null,
    };

    try {
        await onSubmit(packageData);
        // Reset form after success (optional, or handle in parent)
        setFormData(DEFAULT_FORM_DATA);
        setCurrentStep(0);
    } catch (error) {
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <GeneralInfoStep formData={formData} onChange={handleChange} errors={errors} />;
      case 1:
        return <HotelDetailsStep formData={formData} onChange={handleChange} errors={errors} />;
      case 2:
        return <FlightDetailsStep formData={formData} onChange={handleChange} errors={errors} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;
  const canSkipStep = (currentStep === 1 && !formData.includesHotel) || (currentStep === 2 && !formData.includesFlight);

  return (
    // Changed Card to div with glass-card class to match AdminDashboard style
    <div className="glass-card p-6 w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy mb-2">
          {isEditing ? 'Editar Paquete' : 'Crear nuevo paquete'}
        </h2>
        <FormStepIndicator steps={STEPS} currentStep={currentStep} />
      </div>
      
      <div className="min-h-[400px] py-4">
        <AnimatePresence mode="wait">
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
            >
                {renderStep()}
            </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-between gap-4 mt-8 border-t border-white/20 pt-6">
        <Button variant="outline" onClick={onCancel} className="hover:bg-destructive/10 hover:text-destructive">
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        
        <div className="flex gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handleBack}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Atrás
            </Button>
          )}
          
          {isLastStep ? (
            <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white min-w-[140px]"
            >
              {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                  <Check className="w-4 h-4 mr-2" />
              )}
              {isEditing ? 'Actualizar' : 'Crear Paquete'}
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-navy hover:bg-navy/90 text-white">
              {canSkipStep ? 'Omitir' : 'Siguiente'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
