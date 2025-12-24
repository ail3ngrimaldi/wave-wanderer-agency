import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PackageFormData, RoomType, MealPlan, AccommodationType, ROOM_TYPE_LABELS, MEAL_PLAN_LABELS, ACCOMMODATION_TYPE_LABELS } from '@/types/package';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, BedDouble, UtensilsCrossed, AlertCircle, Home, Image, Plus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

interface HotelDetailsStepProps {
  formData: PackageFormData;
  onChange: (field: keyof PackageFormData, value: any) => void;
  errors: Partial<Record<keyof PackageFormData, string>>;
}

const getAccommodationLabel = (type: AccommodationType, context: 'article' | 'preview') => {
  const labels = {
    hotel: { article: 'del Hotel', preview: 'hotel' },
    cabin: { article: 'de la Cabaña', preview: 'cabaña' },
    house: { article: 'de la Casa', preview: 'casa' }
  };
  return labels[type][context];
};

export function HotelDetailsStep({ formData, onChange, errors }: HotelDetailsStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles = [...formData.mediaFiles, ...files];
      onChange('mediaFiles', newFiles);
    }
    // Reset input para permitir seleccionar el mismo archivo nuevamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = formData.mediaFiles.filter((_, i) => i !== index);
    onChange('mediaFiles', newFiles);
  };

  const getFilePreview = (file: File) => {
    return URL.createObjectURL(file);
  };

  const isVideo = (file: File) => {
    return file.type.startsWith('video/');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 text-primary mb-4">
        <Building2 className="w-6 h-6" />
        <h3 className="text-lg font-semibold">Información del Alojamiento</h3>
      </div>

      {/* Tipo de Alojamiento */}
      <div className="space-y-2">
        <Label htmlFor="accommodationType" className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          Tipo de Alojamiento *
        </Label>
        <Select
          value={formData.accommodationType}
          onValueChange={(value: AccommodationType) => onChange('accommodationType', value)}
        >
          <SelectTrigger className={errors.accommodationType ? 'border-destructive' : ''}>
            <SelectValue placeholder="Seleccionar tipo de alojamiento" />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(ACCOMMODATION_TYPE_LABELS) as AccommodationType[]).map((type) => (
              <SelectItem key={type} value={type}>
                {ACCOMMODATION_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.accommodationType && <p className="text-sm text-destructive">{errors.accommodationType}</p>}
      </div>
      
      {/* Nombre */}
      <div className="space-y-2">
        <Label htmlFor="hotelName" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Nombre {getAccommodationLabel(formData.accommodationType, 'article')} *
        </Label>
        <Input
          id="hotelName"
          placeholder={`Ej: ${formData.accommodationType === 'hotel' ? 'Grand Paradise Resort' : formData.accommodationType === 'cabin' ? 'Cabañas del Bosque' : 'Casa Vista al Mar'}`}
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

      {/* SECCIÓN DE MEDIOS */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Fotos y Videos del Alojamiento
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Subir archivos
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <p className="text-xs text-muted-foreground">
          Sube fotos (JPG, PNG) o videos (MP4). Los videos se reproducirán automáticamente sin sonido.
          Máximo recomendado: 10 archivos.
        </p>

        {/* Preview de archivos seleccionados */}
        {formData.mediaFiles.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {formData.mediaFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video rounded-lg overflow-hidden bg-muted border">
                  {isVideo(file) ? (
                    <video
                      src={getFilePreview(file)}
                      className="w-full h-full object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={getFilePreview(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        )}
        
        {formData.mediaFiles.length === 0 && (
          <div className="text-center py-8 border border-dashed rounded-lg">
            <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">
              No hay archivos seleccionados
            </p>
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="mt-8 p-4 rounded-lg bg-muted/50 border">
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Vista previa</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-primary px-2 py-1 rounded-full bg-primary/10">
              {ACCOMMODATION_TYPE_LABELS[formData.accommodationType]}
            </span>
          </div>
          <p className="font-medium">
            {formData.hotelName || `Nombre ${getAccommodationLabel(formData.accommodationType, 'preview')}`}
          </p>
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
          {formData.mediaFiles.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              📸 {formData.mediaFiles.length} archivo(s) para subir
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
