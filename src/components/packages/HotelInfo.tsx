import { Building2, BedDouble, UtensilsCrossed } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROOM_TYPE_LABELS, MEAL_PLAN_LABELS, RoomType, MealPlan } from "@/types/package";

interface HotelInfoProps {
  hotelName: string | null;
  roomType?: string | null;
  mealPlan?: string | null;
  nights: number;
}

export const HotelInfo = ({
  hotelName,
  roomType,
  mealPlan,
  nights,
}: HotelInfoProps) => {
  // Helpers to get nice labels if the data exists
  const roomLabel = roomType ? ROOM_TYPE_LABELS[roomType as RoomType] || roomType : null;
  const mealLabel = mealPlan ? MEAL_PLAN_LABELS[mealPlan as MealPlan] || mealPlan : null;

  return (
    <Dialog>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
               {/* TRIGGER BUTTON - MATCHING YOUR TURQUOISE STYLE */}
              <button 
                className="w-14 h-14 rounded-full bg-turquoise flex items-center justify-center cursor-pointer hover:bg-turquoise/80 transition-all hover:scale-105 shadow-lg"
                type="button"
              >
                <Building2 className="w-7 h-7 text-white" />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          
          <TooltipContent className="max-w-xs bg-white text-navy border-none shadow-xl">
            <div className="space-y-1">
              <p className="font-bold text-navy">{hotelName || "Hotel incluido"}</p>
              <div className="text-xs text-muted-foreground">
                <p>{nights} noches</p>
                {roomLabel && <p>{roomLabel}</p>}
                {mealLabel && <p>{mealLabel}</p>}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy text-xl">
            <div className="p-2 bg-turquoise/10 rounded-full">
                <Building2 className="w-5 h-5 text-turquoise" />
            </div>
            Detalles del Hotel
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-1 pb-4 border-b border-border/50">
            <h4 className="font-bold text-2xl text-navy">{hotelName || "Hotel seleccionado"}</h4>
            <p className="text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Estadía de {nights} noches
            </p>
          </div>
          
          <div className="grid gap-4">
            {roomType && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="p-3 bg-white rounded-full shadow-sm">
                    <BedDouble className="w-6 h-6 text-turquoise" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de habitación</p>
                  <p className="font-semibold text-navy text-lg">{roomLabel}</p>
                </div>
              </div>
            )}
            
            {mealPlan && (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="p-3 bg-white rounded-full shadow-sm">
                    <UtensilsCrossed className="w-6 h-6 text-turquoise" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Régimen de comidas</p>
                  <p className="font-semibold text-navy text-lg">{mealLabel}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper for the Clock icon which I used above but forgot to import
import { Clock } from "lucide-react";
