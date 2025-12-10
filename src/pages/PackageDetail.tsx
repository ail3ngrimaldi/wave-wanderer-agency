import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, MessageCircle, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { usePackages } from "@/contexts/PackagesContext";
import logoViasol from "@/assets/logo-viasol.jpeg";

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getPackage } = usePackages();
  
  const pkg = id ? getPackage(id) : undefined;

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(180deg, hsl(185 40% 96%) 0%, hsl(185 50% 90%) 100%)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <img src={logoViasol} alt="Via Sol" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-navy mb-2">Paquete no encontrado</h1>
          <p className="text-muted-foreground mb-6">
            Este paquete no existe o ya no está disponible
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hola! Me interesa el paquete "${pkg.title}". ¿Podrían darme más información?`
  );
  const whatsappUrl = `https://wa.me/5491112345678?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, hsl(0 0% 99%) 0%, hsl(185 40% 96%) 100%)' }}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoViasol} alt="Via Sol" className="w-10 h-10 object-contain" />
            <span className="font-bold text-navy hidden sm:inline">Via Sol Travel</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Image */}
          <div className="aspect-video rounded-3xl overflow-hidden mb-8 bg-muted">
            {pkg.imageUrl ? (
              <img
                src={pkg.imageUrl}
                alt={pkg.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-20 h-20 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="glass-card p-8">
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <h1 className="text-3xl font-bold text-navy">{pkg.title}</h1>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {pkg.description}
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-full font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95"
                style={{ background: '#25D366' }}
              >
                <MessageCircle className="w-5 h-5" />
                Consultar por WhatsApp
              </a>
              <Link
                to="/"
                className="flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-full font-semibold text-navy border-2 border-border hover:border-primary hover:text-primary transition-all"
              >
                Ver más paquetes
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PackageDetail;
