import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface MediaGalleryProps {
  mediaUrls: string[];
}

export const MediaGallery = ({ mediaUrls }: MediaGalleryProps) => {
  if (!mediaUrls || mediaUrls.length === 0) return null;

  const isVideo = (url: string) => {
    return url.match(/\.(mp4|webm|ogg|mov|avi|mkv|m4v)$/i) !== null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3 }}
      className="w-full px-4 py-12"
    >
      <h3 className="text-white text-2xl md:text-3xl font-bold mb-8 text-center">
        Galería del Alojamiento
      </h3>
      
      {/* Masonry Grid - Responsive */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 max-w-7xl mx-auto">
        {mediaUrls.map((url, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 + index * 0.1 }}
            className="break-inside-avoid mb-4"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-golden">
              {isVideo(url) ? (
                <video
                  src={url}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto"
                />
              ) : (
                <img
                  src={url}
                  alt={`Alojamiento ${index + 1}`}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
