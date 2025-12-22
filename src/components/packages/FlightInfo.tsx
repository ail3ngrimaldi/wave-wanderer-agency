import { Plane, Clock, MapPin } from "lucide-react";
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

interface FlightInfoProps {
  airline?: string | null;
  departureAirport?: string | null;
  arrivalAirport?: string | null;
  outboundDepartureTime?: string | null;
  outboundArrivalTime?: string | null;
  returnDepartureTime?: string | null;
  returnArrivalTime?: string | null;
}

export const FlightInfo = ({
  airline,
  departureAirport,
  arrivalAirport,
  outboundDepartureTime,
  outboundArrivalTime,
  returnDepartureTime,
  returnArrivalTime,
}: FlightInfoProps) => {
  const hasDetails = airline || departureAirport || arrivalAirport;

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
                <Plane className="w-7 h-7 text-white" />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          
          <TooltipContent className="max-w-xs bg-white text-navy border-none shadow-xl">
            <div className="space-y-2">
              <p className="font-bold text-navy">Vuelo incluido</p>
              {hasDetails ? (
                <div className="text-xs text-muted-foreground space-y-1">
                  {airline && <p><span className="font-semibold">Aerolínea:</span> {airline}</p>}
                  {departureAirport && arrivalAirport && (
                    <p>{departureAirport} ↔ {arrivalAirport}</p>
                  )}
                  <p className="text-turquoise text-[10px] mt-1 italic">Click para ver horarios</p>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Click para ver detalles</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-white/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-navy text-xl">
            <div className="p-2 bg-turquoise/10 rounded-full">
                <Plane className="w-5 h-5 text-turquoise" />
            </div>
            Detalles del Vuelo
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {airline && (
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-muted-foreground">Aerolínea</span>
              <span className="font-bold text-navy text-lg">{airline}</span>
            </div>
          )}

          {/* Outbound Flight */}
          {(departureAirport || outboundDepartureTime) && (
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <h4 className="font-bold text-navy flex items-center gap-2 mb-3">
                <Plane className="w-4 h-4 text-turquoise" />
                Ida
              </h4>
              
              {departureAirport && arrivalAirport && (
                <div className="flex items-center gap-3 text-sm mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex items-center gap-2 font-medium">
                    <span>{departureAirport}</span>
                    <span className="text-muted-foreground">→</span>
                    <span>{arrivalAirport}</span>
                  </div>
                </div>
              )}
              
              {outboundDepartureTime && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="grid grid-cols-2 gap-x-4">
                    <span>Salida: <span className="font-semibold">{outboundDepartureTime}</span></span>
                    {outboundArrivalTime && <span>Llegada: <span className="font-semibold">{outboundArrivalTime}</span></span>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Return Flight */}
          {(returnDepartureTime || (departureAirport && arrivalAirport)) && (
            <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <h4 className="font-bold text-navy flex items-center gap-2 mb-3">
                <Plane className="w-4 h-4 text-turquoise rotate-180" />
                Vuelta
              </h4>
              
              {departureAirport && arrivalAirport && (
                <div className="flex items-center gap-3 text-sm mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex items-center gap-2 font-medium">
                    <span>{arrivalAirport}</span>
                    <span className="text-muted-foreground">→</span>
                    <span>{departureAirport}</span>
                  </div>
                </div>
              )}
              
              {returnDepartureTime && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="grid grid-cols-2 gap-x-4">
                    <span>Salida: <span className="font-semibold">{returnDepartureTime}</span></span>
                    {returnArrivalTime && <span>Llegada: <span className="font-semibold">{returnArrivalTime}</span></span>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
