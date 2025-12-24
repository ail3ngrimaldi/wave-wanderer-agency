import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Link as LinkIcon, CheckCircle, Copy, Share2, Trash2, ImageIcon, ExternalLink, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePackages, Package } from "@/contexts/PackagesContext";
import { toast } from "@/hooks/use-toast";
import logoViasol from "@/assets/logo-viasol.svg";
// Import the new form
import { MultiStepPackageForm } from "./MultiStepPackageForm";

const AdminDashboard = () => {
  const { logout } = useAuth();
  const { packages, loading, addPackage, deletePackage } = usePackages();
  const navigate = useNavigate();
  
  // We don't need all the individual useStates anymore! 
  // We just need state for the generated link result.
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  // This function now receives the clean data object from the MultiStepForm
  const handleCreatePackage = async (formData: any) => {
    const id = await addPackage(formData);

    if (!id) {
      toast({
        title: "Error",
        description: "No se pudo crear el paquete. Intenta de nuevo.",
        variant: "destructive",
      });
      return;
    }

    const link = `${window.location.origin}/paquete/${result.slug}`;
    setGeneratedLink(link);

    toast({
      title: "¡Paquete creado!",
      description: "El link ha sido generado exitosamente",
    });
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

  const clearGeneratedLink = () => {
    setGeneratedLink(null);
  }

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
          
          {/* LEFT COLUMN: Create Package Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* If we have a generated link, show it prominently */}
            <AnimatePresence>
                {generatedLink && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-6 p-4 rounded-2xl bg-primary/10 border border-primary/20 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-primary">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">¡Link generado!</span>
                        </div>
                        <button onClick={clearGeneratedLink} className="text-muted-foreground hover:text-navy text-xs">
                            Crear otro
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-3 bg-card rounded-xl text-sm text-navy truncate border border-white/50">
                        {generatedLink}
                      </code>
                      <button
                        onClick={() => copyToClipboard(generatedLink)}
                        className="p-3 rounded-xl bg-card hover:bg-white transition-colors border border-transparent hover:border-primary/20"
                        title="Copiar"
                      >
                        <Copy className="w-4 h-4 text-navy" />
                      </button>
                      <button
                        onClick={() => handleShare(generatedLink)}
                        className="p-3 rounded-xl bg-card hover:bg-white transition-colors border border-transparent hover:border-primary/20"
                        title="Compartir"
                      >
                        <Share2 className="w-4 h-4 text-navy" />
                      </button>
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>

            {/* THE NEW MULTI-STEP FORM */}
            <MultiStepPackageForm 
                onSubmit={handleCreatePackage} 
                onCancel={() => window.location.reload()} 
            />
            
          </motion.div>

          {/* RIGHT COLUMN: Package List (Unchanged logic, just simplified JSX) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 h-fit"
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
              <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
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

// ... PackageCard component remains exactly the same as in your base code ...
interface PackageCardProps {
  pkg: Package;
  onCopy: (link: string) => void;
  onShare: (link: string) => void;
  onDelete: () => void;
  isCopied: boolean;
}

const PackageCard = ({ pkg, onCopy, onShare, onDelete, isCopied }: PackageCardProps) => {
    // ... Copy your existing PackageCard code here ...
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
