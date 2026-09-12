import React, { useEffect } from 'react';
import { X, Smartphone, Calendar, MapPin, CheckCircle, Star, Quote } from 'lucide-react';

export default function StoryLightboxModal({ isOpen, story, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !story) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col md:flex-row max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-2xl border border-outline-variant/40 bg-surface-container shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 rounded-full bg-black/70 p-2 text-white/80 hover:text-white hover:bg-black transition-colors"
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Large Image Preview */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] md:min-h-[500px] overflow-hidden">
          <img
            src={story.image}
            alt={story.phoneBought}
            className="w-full h-full max-h-[70vh] md:max-h-[85vh] object-contain"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/20 flex items-center gap-1.5 shadow-lg">
              <Smartphone size={14} className="text-primary" />
              {story.phoneBought}
            </span>
          </div>
        </div>

        {/* Info Column */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col justify-between p-6 bg-surface-container border-t md:border-t-0 md:border-l border-outline-variant/30 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle size={13} />
                Verified Purchase
              </span>
              <div className="flex items-center text-amber-400 text-sm">
                {'★'.repeat(story.rating || 5)}
              </div>
            </div>

            <h3 className="mt-4 text-xl font-bold text-white">
              {story.customerName}
            </h3>

            <div className="mt-2 flex flex-col gap-1 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <Smartphone size={13} className="text-primary" />
                <strong className="text-white">Device:</strong> {story.phoneBought}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-primary" />
                <strong className="text-white">Date:</strong> {story.date}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={13} className="text-primary" />
                <strong className="text-white">Store:</strong> {story.storeLocation}
              </span>
            </div>

            <div className="mt-6 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 p-4 relative">
              <Quote size={20} className="text-primary/40 mb-1" />
              <p className="text-sm italic text-on-surface leading-relaxed">
                "{story.feedback}"
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <span>Gagan Mobile Care Retail</span>
            <button
              onClick={onClose}
              className="rounded-lg bg-surface-container-high px-4 py-1.5 text-xs font-medium text-white hover:bg-surface-container-highest transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
