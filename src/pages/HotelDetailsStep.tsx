import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PackageFormData, RoomType, MealPlan, AccomodationType, ROOM_TYPE_LABELS, MEAL_PLAN_LABELS, ACCOMODATION_TYPE_LABELS } from '@/types/package'; // AGREGAR AccomodationType y ACCOMODATION_TYPE_LABELS
import { Building2, BedDouble, UtensilsCrossed, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface HotelDetailsStepProps {
  formData: PackageFormData;
  onChange: (field: keyof PackageFormData, value: any) => void;
  errors: Partial<Record<keyof PackageFormData, string>>;
}

export function HotelDetailsStep({ formData, onChange, errors }: HotelDetailsStepProps) {
  if (!formData.includesHotel) {
    return (
      <Alert className="border-muted">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Este paquete no incluye hotel. Vuelve al Paso 1 y marca "Hotel" en "El paquete incluye" para agregar detalles del hotel.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-primary mb-4">
        <Building2 className="w-6 h-6" />
        <h3 className="text-lg font-semibold">Información del Hotel</h3>
      </div>

      {/* NUEVO: Tipo de Alojamiento */}
       <div className="space-y-2">
        <Label htmlFor="accomodationType" className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          Tipo de Alojamiento *
        </Label>
        <Select
          value={formData.accomodationType}
          onValueChange={(value: AccomodationType) => onChange('accomodationType', value)}
        >
          <SelectTrigger className={errors.accomodationType ? 'border-destructive' : ''}>
            <SelectValue placeholder="Seleccionar tipo de alojamiento" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(ACCOMODATION_TYPE_LABELS) as AccomodationType[]).map((type) => (
              <SelectItem key={type} value={type}>
                {ACCOMODATION_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.accomodationType && <p className="text-sm text-destructive">{errors.accomodationType}</p>}
      </div>
      
      {/* Hotel Name */}
      <div className="space-y-2">
        <Label htmlFor="hotelName" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          {ACCOMODATION_TYPE_LABELS[formData.accomodationType]} *
        </Label>
        <Input
          id="hotelName"
          placeholder={`Ej: ${formData.accomodationType === 'hotel' ? 'Grand Paradise Resort' : formData.accomodationType === 'cabin' ? 'Cabañas del Bosque' : 'Casa Vista al Mar'}`}
          value={formData.hotelName}
          onChange={(e) => onChange('hotelName', e.target.value)}
          className={errors.hotelName ? 'border-destructive' : ''}
        />
        {errors.hotelName && <p className="text-sm text-destructive">{errors.hotelName}</p>}
      </div>

      {/* Room Type */}
      <div className="space-y-2">
        <Label htmlFor="roomType" className="flex items-center gap-2">
          <BedDouble className="w-4 h-4" />
          Tipo de Habitación *
        </Label>
        <Select
          value={formData.roomType}
          onValueChange={(value: RoomType) => onChange('roomType', value)}
        >
          <SelectTrigger className={errors.roomType ? 'border-destructive' : ''}>
            <SelectValue placeholder="Seleccionar tipo de habitación" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(ROOM_TYPE_LABELS) as RoomType[]).map((type) => (
              <SelectItem key={type} value={type}>
                {ROOM_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.roomType && <p className="text-sm text-destructive">{errors.roomType}</p>}
      </div>

      {/* Meal Plan */}
      <div className="space-y-2">
        <Label htmlFor="mealPlan" className="flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4" />
          Plan de Comidas *
        </Label>
        <Select
          value={formData.mealPlan}
          onValueChange={(value: MealPlan) => onChange('mealPlan', value)}
        >
          <SelectTrigger className={errors.mealPlan ? 'border-destructive' : ''}>
            <SelectValue placeholder="Seleccionar plan de comidas" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(MEAL_PLAN_LABELS) as MealPlan[]).map((plan) => (
              <SelectItem key={plan} value={plan}>
                {MEAL_PLAN_LABELS[plan]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.mealPlan && <p className="text-sm text-destructive">{errors.mealPlan}</p>}
      </div>

      {/* Preview */}
      <div className="mt-8 p-4 rounded-lg bg-muted/50 border">
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Vista previa</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
              {ACCOMODATION_TYPE_LABELS[formData.accomodationType]}
            </span>
          </div>
          <p className="font-medium">{formData.hotelName || `Nombre del ${ACCOMODATION_TYPE_LABELS[formData.accomodationType].toLowerCase()}`}</p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <BedDouble className="w-3 h-3" />
              {ROOM_TYPE_LABELS[formData.roomType]}
            </span>
            <span className="flex items-center gap-1">
              <UtensilsCrossed className="w-3 h-3" />
              {MEAL_PLAN_LABELS[formData.mealPlan]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
