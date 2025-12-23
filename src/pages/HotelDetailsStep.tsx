import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PackageFormData, RoomType, MealPlan, ROOM_TYPE_LABELS, MEAL_PLAN_LABELS } from '@/types/package';
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

      <div className="space-y-2">
            <Label htmlFor="accommodationType" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Tipo de Alojamiento *
            </Label>
            <Select
            value={formData.accomodationType} // Pay attention to spelling: 1 'm' or 2 'm's based on your Types file
            onValueChange={(value: any) => onChange('accomodationType', value)}
            >
            <SelectTrigger>
                <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
                {(Object.keys(ACCOMMODATION_TYPE_LABELS) as any[]).map((type) => (
                <SelectItem key={type} value={type}>
                    {ACCOMMODATION_TYPE_LABELS[type]}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>

      {/* Hotel Name */}
      <div className="space-y-2">
        <Label htmlFor="hotelName" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Nombre del Hotel *
        </Label>
        <Input
          id="hotelName"
          placeholder="Ej: Grand Paradise Resort"
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
          <p className="font-medium">{formData.hotelName || 'Nombre del hotel'}</p>
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
