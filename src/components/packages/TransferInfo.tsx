import { Bus, Info, ShieldCheck } from "lucide-react";
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

export const TransferInfo = () => {
  return (
    <Dialog>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              {/* Trigger Button - Matches your Turquoise Style */}
              <button 
                className="w-14 h-14 rounded-full bg-turquoise flex items-center justify-center cursor-pointer hover:bg-turquoise/80 transition-all hover:scale-105 shadow-lg"
                type="button"
              >
                <Bus className="w-7 h-7 text-white" />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          
          <TooltipContent className="max-w-xs bg-white text-navy border-none shadow-xl">
            <p className="font-bold text-navy text-xs">Traslado Privado</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy text-xl">
            <div className="p-2 bg-turquoise/10 rounded-full">
                <Bus className="w-5 h-5 text-turquoise" />
            </div>
            Detalles del Traslado
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
           {/* Info Block */}
           <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
             <ShieldCheck className="w-6 h-6 text-turquoise mt-1 shrink-0" />
             <div>
               <h4 className="font-bold text-navy mb-1">Servicio Exclusivo</h4>
               <p className="text-sm text-muted-foreground leading-relaxed">
                 El servicio de traslado incluido en este paquete es <strong>100% privado</strong>. 
                 El vehículo será exclusivo para tu grupo y no se comparte con otros pasajeros.
               </p>
             </div>
           </div>

           <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
             <Info className="w-4 h-4" />
             <span>Incluye tramos Aeropuerto ↔ Alojamiento</span>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
