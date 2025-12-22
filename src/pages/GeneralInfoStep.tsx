import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PackageFormData } from '@/types/package';
import { Plane, Building2, Car, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface GeneralInfoStepProps {
  formData: PackageFormData;
  onChange: (field: keyof PackageFormData, value: any) => void;
  errors: Partial<Record<keyof PackageFormData, string>>;
}

export function GeneralInfoStep({ formData, onChange, errors }: GeneralInfoStepProps) {
  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="title">Título del Paquete *</Label>
          <Input
            id="title"
            placeholder="Ej: Paquete Buzios 7 noches"
            value={formData.title}
            onChange={(e) => onChange('title', e.target.value)}
            className={errors.title ? 'border-destructive' : ''}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        </div>
        
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Descripción (opcional)</Label>
          <Textarea
            id="description"
            placeholder="Información adicional sobre el paquete..."
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Location */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="destination">Destino *</Label>
          <Input
            id="destination"
            placeholder="Ej: Buzios"
            value={formData.destination}
            onChange={(e) => onChange('destination', e.target.value)}
            className={errors.destination ? 'border-destructive' : ''}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">País *</Label>
          <Input
            id="country"
            placeholder="Ej: Brasil"
            value={formData.country}
            onChange={(e) => onChange('country', e.target.value)}
            className={errors.country ? 'border-destructive' : ''}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="departureCity">Salida desde *</Label>
          <Input
            id="departureCity"
            placeholder="Ej: Córdoba"
            value={formData.departureCity}
            onChange={(e) => onChange('departureCity', e.target.value)}
            className={errors.departureCity ? 'border-destructive' : ''}
          />
        </div>
      </div>

      {/* Dates & Duration */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Fecha inicio
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                {formData.startDate ? format(formData.startDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                <CalendarIcon className="w-4 h-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => onChange('startDate', date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Fecha fin
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                {formData.endDate ? format(formData.endDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar"}
                <CalendarIcon className="w-4 h-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => onChange('endDate', date)}
                disabled={(date) => formData.startDate ? date < formData.startDate : false}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nights">Noches *</Label>
          <Input
            id="nights"
            type="number"
            min={1}
            value={formData.nights}
            onChange={(e) => onChange('nights', parseInt(e.target.value) || 1)}
          />
        </div>
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL de la imagen</Label>
        <Input
          id="imageUrl"
          placeholder="https://..."
          value={formData.imageUrl}
          onChange={(e) => onChange('imageUrl', e.target.value)}
        />
      </div>

      {/* Pricing */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="price">Precio *</Label>
          <Input
            id="price"
            type="number"
            min={0}
            value={formData.price}
            onChange={(e) => onChange('price', parseFloat(e.target.value) || 0)}
            className={errors.price ? 'border-destructive' : ''}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currency">Moneda</Label>
          <select
            id="currency"
            value={formData.currency}
            onChange={(e) => onChange('currency', e.target.value)}
            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="USD">USD</option>
            <option value="ARS">ARS</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priceNote">Nota de precio</Label>
          <Input
            id="priceNote"
            placeholder="TARIFA POR PERSONA, BASE DBL"
            value={formData.priceNote}
            onChange={(e) => onChange('priceNote', e.target.value)}
          />
        </div>
      </div>

      {/* Package Inclusions */}
      <div className="space-y-4">
        <Label className="text-base">El paquete incluye</Label>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includesFlight"
              checked={formData.includesFlight}
              onCheckedChange={(checked) => onChange('includesFlight', checked)}
            />
            <Label htmlFor="includesFlight" className="flex items-center gap-2 cursor-pointer">
              <Plane className="w-4 h-4 text-primary" />
              Vuelo
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includesHotel"
              checked={formData.includesHotel}
              onCheckedChange={(checked) => onChange('includesHotel', checked)}
            />
            <Label htmlFor="includesHotel" className="flex items-center gap-2 cursor-pointer">
              <Building2 className="w-4 h-4 text-primary" />
              Hotel
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includesTransfer"
              checked={formData.includesTransfer}
              onCheckedChange={(checked) => onChange('includesTransfer', checked)}
            />
            <Label htmlFor="includesTransfer" className="flex items-center gap-2 cursor-pointer">
              <Car className="w-4 h-4 text-primary" />
              Transfer
            </Label>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="disclaimer">Disclaimer (letra chica)</Label>
          <Textarea
            id="disclaimer"
            placeholder="Ej: Sujeto a disponibilidad y modificación al momento de la reserva..."
            value={formData.disclaimer}
            onChange={(e) => onChange('disclaimer', e.target.value)}
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paymentLink">Link de pago</Label>
          <Input
            id="paymentLink"
            placeholder="https://..."
            value={formData.paymentLink}
            onChange={(e) => onChange('paymentLink', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
