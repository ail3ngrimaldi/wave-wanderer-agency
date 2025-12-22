import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PackageFormData } from '@/types/package';
import { Plane, PlaneTakeoff, PlaneLanding, Clock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FlightDetailsStepProps {
  formData: PackageFormData;
  onChange: (field: keyof PackageFormData, value: any) => void;
  errors: Partial<Record<keyof PackageFormData, string>>;
}

export function FlightDetailsStep({ formData, onChange, errors }: FlightDetailsStepProps) {
  if (!formData.includesFlight) {
    return (
      <Alert className="border-muted">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Este paquete no incluye vuelo. Vuelve al Paso 1 y marca "Vuelo" en "El paquete incluye" para agregar detalles del vuelo.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-primary mb-4">
        <Plane className="w-6 h-6" />
        <h3 className="text-lg font-semibold">Información del Vuelo</h3>
      </div>

      {/* Airline */}
      <div className="space-y-2">
        <Label htmlFor="airline" className="flex items-center gap-2">
          <Plane className="w-4 h-4" />
          Aerolínea *
        </Label>
        <Input
          id="airline"
          placeholder="Ej: Aerolíneas Argentinas"
          value={formData.airline}
          onChange={(e) => onChange('airline', e.target.value)}
          className={errors.airline ? 'border-destructive' : ''}
        />
        {errors.airline && <p className="text-sm text-destructive">{errors.airline}</p>}
      </div>

      {/* Airports */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="departureAirport" className="flex items-center gap-2">
            <PlaneTakeoff className="w-4 h-4" />
            Aeropuerto de Salida *
          </Label>
          <Input
            id="departureAirport"
            placeholder="Ej: COR - Córdoba"
            value={formData.departureAirport}
            onChange={(e) => onChange('departureAirport', e.target.value)}
            className={errors.departureAirport ? 'border-destructive' : ''}
          />
          {errors.departureAirport && <p className="text-sm text-destructive">{errors.departureAirport}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="arrivalAirport" className="flex items-center gap-2">
            <PlaneLanding className="w-4 h-4" />
            Aeropuerto de Llegada *
          </Label>
          <Input
            id="arrivalAirport"
            placeholder="Ej: GIG - Río de Janeiro"
            value={formData.arrivalAirport}
            onChange={(e) => onChange('arrivalAirport', e.target.value)}
            className={errors.arrivalAirport ? 'border-destructive' : ''}
          />
          {errors.arrivalAirport && <p className="text-sm text-destructive">{errors.arrivalAirport}</p>}
        </div>
      </div>

      {/* Outbound Flight Times */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <PlaneTakeoff className="w-4 h-4 text-primary" />
          Vuelo de Ida
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="outboundDepartureTime" className="flex items-center gap-2 text-sm">
              <Clock className="w-3 h-3" />
              Hora de Salida
            </Label>
            <Input
              id="outboundDepartureTime"
              type="time"
              value={formData.outboundDepartureTime}
              onChange={(e) => onChange('outboundDepartureTime', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="outboundArrivalTime" className="flex items-center gap-2 text-sm">
              <Clock className="w-3 h-3" />
              Hora de Llegada
            </Label>
            <Input
              id="outboundArrivalTime"
              type="time"
              value={formData.outboundArrivalTime}
              onChange={(e) => onChange('outboundArrivalTime', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Return Flight Times */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <PlaneLanding className="w-4 h-4 text-primary" />
          Vuelo de Regreso
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="returnDepartureTime" className="flex items-center gap-2 text-sm">
              <Clock className="w-3 h-3" />
              Hora de Salida
            </Label>
            <Input
              id="returnDepartureTime"
              type="time"
              value={formData.returnDepartureTime}
              onChange={(e) => onChange('returnDepartureTime', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="returnArrivalTime" className="flex items-center gap-2 text-sm">
              <Clock className="w-3 h-3" />
              Hora de Llegada
            </Label>
            <Input
              id="returnArrivalTime"
              type="time"
              value={formData.returnArrivalTime}
              onChange={(e) => onChange('returnArrivalTime', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Vista previa</h4>
        <div className="space-y-3">
          <p className="font-medium">{formData.airline || 'Nombre de aerolínea'}</p>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center gap-2">
              <PlaneTakeoff className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">Ida:</span>
              <span>{formData.departureAirport || 'SAL'}</span>
              <span>→</span>
              <span>{formData.arrivalAirport || 'LLE'}</span>
              {formData.outboundDepartureTime && (
                <span className="text-muted-foreground ml-2">
                  {formData.outboundDepartureTime} - {formData.outboundArrivalTime}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <PlaneLanding className="w-3 h-3 text-primary" />
              <span className="text-muted-foreground">Regreso:</span>
              <span>{formData.arrivalAirport || 'LLE'}</span>
              <span>→</span>
              <span>{formData.departureAirport || 'SAL'}</span>
              {formData.returnDepartureTime && (
                <span className="text-muted-foreground ml-2">
                  {formData.returnDepartureTime} - {formData.returnArrivalTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
