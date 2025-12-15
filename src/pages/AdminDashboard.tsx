import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, Upload, Link as LinkIcon, Copy, Share2, Trash2, 
  Image as ImageIcon, CheckCircle, Loader2, ExternalLink,
  Plane, Building2, Bus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePackages, Package } from "@/contexts/PackagesContext";
import { toast } from "@/hooks/use-toast";
import logoViasol from "@/assets/logo-viasol.svg";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { packages, loading, addPackage, deletePackage } = usePackages();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [nights, setNights] = useState(7);
  const [includesFlight, setIncludesFlight] = useState(true);
  const [includesHotel, setIncludesHotel] = useState(true);
  const [includesTransfer, setIncludesTransfer] = useState(true);
  const [hotelName, setHotelName] = useState("");
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [priceNote, setPriceNote] = useState("TARIFA POR PERSONA, BASE DBL");
  const [disclaimer, setDisclaimer] = useState("");
  const [paymentLink, setPaymentLink] = useState("");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateLink = async () => {
    if (!title.trim() || !destination.trim() || !country.trim()) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa el título, destino y país",
        variant: "destructive",
      });
      return;
    }

    if (price <= 0) {
      toast({
        title: "Precio inválido",
        description: "Por favor ingresa un precio válido",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    const packageData = {
      title,
      description,
      imageUrl: imagePreview || null,
      destination,
      country,
      departureCity,
      nights,
      includesFlight,
      includesHotel,
      includesTransfer,
      hotelName: hotelName || null,
      price,
      currency,
      priceNote: priceNote || null,
      disclaimer: disclaimer || null,
      paymentLink: paymentLink || null,
    };

    const id = await addPackage(packageData);
    setIsGenerating(false);

    if (!id) {
      toast({
        title: "Error",
        description: "No se pudo crear el paquete. Intenta de nuevo.",
        variant: "destructive",
      });
      return;
    }

    const link = `${window.location.origin}/paquete/${id}`;
    setGeneratedLink(link);

    toast({
      title: "¡Paquete creado!",
      description: "El link ha sido generado exitosamente",
    });

    // Reset form
    setTitle("");
    setDescription("");
    setImagePreview(null);
    setDestination("");
    setCountry("");
    setDepartureCity("");
    setNights(7);
    setIncludesFlight(true);
    setIncludesHotel(true);
    setIncludesTransfer(true);
    setHotelName("");
    setPrice(0);
    setCurrency("USD");
    setPriceNote("TARIFA POR PERSONA, BASE DBL");
    setDisclaimer("");
    setPaymentLink("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = async (text: string, id?: string) => {
    await navigator.clipboard.writeText(text);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
    toast({
      title: "¡Link copiado!",
      description: "El link ha sido copiado al portapapeles",
    });
  };

  const handleShare = async (link: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Paquete Via Sol",
          url: link,
        });
      } catch (err) {
        copyToClipboard(link);
      }
    } else {
      copyToClipboard(link);
    }
  };

  const handleDelete = async (id: string) => {
    await deletePackage(id);
    toast({
      title: "Paquete eliminado",
      description: "El paquete ha sido eliminado correctamente",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoViasol} alt="Via Sol" className="w-10 h-10 object-contain" />
            <h1 className="text-xl font-bold text-navy">Panel de Administración</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Create Package Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-navy mb-6">Crear nuevo paquete</h2>

            <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
              {/* Image Upload */}
              <div>
                <label className="label-text flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Imagen del paquete
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative cursor-pointer border-2 border-dashed border-border rounded-2xl p-6 hover:border-primary/50 transition-colors"
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-navy/50 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium">Cambiar imagen</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-8 text-muted-foreground">
                      <Upload className="w-10 h-10" />
                      <span className="text-sm">Haz clic para subir una imagen</span>
                      <span className="text-xs">JPG, PNG o WEBP</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Title */}
              <div>
                <label className="label-text">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Paquete Buzios 7 noches"
                  className="input-field"
                />
              </div>

              {/* Destination & Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Destino</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ej: Buzios"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">País</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Ej: Brasil"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Departure City & Nights */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Salida desde</label>
                  <input
                    type="text"
                    value={departureCity}
                    onChange={(e) => setDepartureCity(e.target.value)}
                    placeholder="Ej: Córdoba"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">Noches</label>
                  <input
                    type="number"
                    value={nights}
                    onChange={(e) => setNights(parseInt(e.target.value) || 0)}
                    min={1}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Includes */}
              <div>
                <label className="label-text mb-3">Incluye</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includesFlight}
                      onChange={(e) => setIncludesFlight(e.target.checked)}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                    />
                    <Plane className="w-5 h-5 text-primary" />
                    <span className="text-sm">Vuelo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includesHotel}
                      onChange={(e) => setIncludesHotel(e.target.checked)}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                    />
                    <Building2 className="w-5 h-5 text-primary" />
                    <span className="text-sm">Hotel</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includesTransfer}
                      onChange={(e) => setIncludesTransfer(e.target.checked)}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
                    />
                    <Bus className="w-5 h-5 text-primary" />
                    <span className="text-sm">Transfer</span>
                  </label>
                </div>
              </div>

              {/* Hotel Name */}
              <div>
                <label className="label-text">Nombre del hotel (con detalles)</label>
                <input
                  type="text"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  placeholder="Ej: Latitud Buzios c/ Desayuno"
                  className="input-field"
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Precio</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    min={0}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label-text">Moneda</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="input-field"
                  >
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              {/* Price Note */}
              <div>
                <label className="label-text">Nota de precio</label>
                <input
                  type="text"
                  value={priceNote}
                  onChange={(e) => setPriceNote(e.target.value)}
                  placeholder="Ej: TARIFA POR PERSONA, BASE DBL"
                  className="input-field"
                />
              </div>

              {/* Payment Link */}
              <div>
                <label className="label-text">Link de pago</label>
                <input
                  type="url"
                  value={paymentLink}
                  onChange={(e) => setPaymentLink(e.target.value)}
                  placeholder="https://..."
                  className="input-field"
                />
              </div>

              {/* Description */}
              <div>
                <label className="label-text">Descripción adicional (opcional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Información adicional sobre el paquete..."
                  className="input-field min-h-[100px] resize-none"
                />
              </div>

              {/* Disclaimer */}
              <div>
                <label className="label-text">Disclaimer (letra chica)</label>
                <textarea
                  value={disclaimer}
                  onChange={(e) => setDisclaimer(e.target.value)}
                  placeholder="Ej: Sujeto a disponibilidad y modificación al momento de la reserva..."
                  className="input-field min-h-[80px] resize-none"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateLink}
                disabled={isGenerating}
                className="btn-cta w-full disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <LinkIcon className="w-5 h-5" />
                      Generar link
                    </>
                  )}
                </span>
              </button>

              {/* Generated Link */}
              <AnimatePresence>
                {generatedLink && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 rounded-2xl bg-primary/10 border border-primary/20"
                  >
                    <div className="flex items-center gap-2 text-primary mb-3">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">¡Link generado!</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-3 bg-card rounded-xl text-sm text-navy truncate">
                        {generatedLink}
                      </code>
                      <button
                        onClick={() => copyToClipboard(generatedLink)}
                        className="p-3 rounded-xl bg-card hover:bg-muted transition-colors"
                        title="Copiar"
                      >
                        <Copy className="w-4 h-4 text-navy" />
                      </button>
                      <button
                        onClick={() => handleShare(generatedLink)}
                        className="p-3 rounded-xl bg-card hover:bg-muted transition-colors"
                        title="Compartir"
                      >
                        <Share2 className="w-4 h-4 text-navy" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Package List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <h2 className="text-xl font-bold text-navy mb-6">
              Paquetes creados ({packages.length})
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
                <p className="text-muted-foreground mt-2">Cargando paquetes...</p>
              </div>
            ) : packages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aún no has creado ningún paquete</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {packages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    onCopy={(link) => copyToClipboard(link, pkg.id)}
                    onShare={(link) => handleShare(link)}
                    onDelete={() => handleDelete(pkg.id)}
                    isCopied={copiedId === pkg.id}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

interface PackageCardProps {
  pkg: Package;
  onCopy: (link: string) => void;
  onShare: (link: string) => void;
  onDelete: () => void;
  isCopied: boolean;
}

const PackageCard = ({ pkg, onCopy, onShare, onDelete, isCopied }: PackageCardProps) => {
  const link = `${window.location.origin}/paquete/${pkg.id}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-muted transition-colors"
    >
      {/* Thumbnail */}
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
        {pkg.imageUrl ? (
          <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-navy truncate">{pkg.title}</h3>
        <p className="text-sm text-muted-foreground">
          {pkg.destination}, {pkg.country} • {pkg.nights} noches • {pkg.currency} {pkg.price}
        </p>
        
        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Ver paquete"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => onCopy(link)}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Copiar link"
          >
            {isCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onShare(link)}
            className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            title="Compartir"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors ml-auto"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
