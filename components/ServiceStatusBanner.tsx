
import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ServiceStatusBannerProps {
  onClose: () => void;
}

const ServiceStatusBanner: React.FC<ServiceStatusBannerProps> = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full z-[200] bg-amber-50/90 backdrop-blur-md border-b border-amber-100 px-4 py-3 flex items-center justify-between shadow-sm animate-fade-in">
      <div className="flex items-center gap-3 pr-4">
        <div className="bg-amber-100 p-1.5 rounded-full shrink-0">
           <AlertTriangle className="w-3 h-3 text-amber-600" />
        </div>
        <p className="font-sans text-[10px] md:text-xs text-stone-600 uppercase tracking-wide leading-tight">
          <span className="font-bold text-stone-800 mr-1">Nota:</span> 
          Si aparece un mensaje de error, es porque SAM está fuera de servicio temporalmente. Por favor intenta más tarde.
        </p>
      </div>
      <button 
        onClick={onClose} 
        className="p-1.5 hover:bg-amber-100 rounded-full transition-colors text-stone-400 hover:text-stone-600 shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ServiceStatusBanner;
