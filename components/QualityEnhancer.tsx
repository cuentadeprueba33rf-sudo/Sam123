import React, { useState, useRef } from 'react';
import { X, Upload, Wand2, AlertCircle, Check, Loader2 } from 'lucide-react';
import { analyzeImageForRestoration } from '../services/geminiService';
import { Note } from '../types';

interface QualityEnhancerProps {
  isOpen: boolean;
  onClose: () => void;
  onRestorationComplete: (note: Note) => void;
}

const QualityEnhancer: React.FC<QualityEnhancerProps> = ({ isOpen, onClose, onRestorationComplete }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnhance = async () => {
    if (!imagePreview) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeImageForRestoration(imagePreview);

      if (result.isValid && result.note) {
        // Create a new Note object from the extracted data
        const restoredNote: Note = {
          id: crypto.randomUUID(),
          content: result.note.content,
          author: result.note.author || "Restaurado",
          theme: result.note.theme,
          style: result.note.style,
          timestamp: Date.now()
        };
        onRestorationComplete(restoredNote);
        handleClose();
      } else {
        setError(result.errorReason || "La imagen no parece ser una nota válida. Solo aceptamos capturas de texto.");
      }
    } catch (e) {
      setError("Hubo un error de conexión. Inténtalo de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClose = () => {
    setImagePreview(null);
    setError(null);
    setIsAnalyzing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={handleClose}></div>

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 text-center relative">
          <button onClick={handleClose} className="absolute right-4 top-4 text-ink/50 hover:text-ink">
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm mb-3">
            <Wand2 className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="font-serif text-xl text-ink font-bold">Mejorador de Calidad</h2>
          <p className="font-sans text-xs text-stone-500 mt-1 max-w-[200px] mx-auto">
            Sube una captura borrosa y la IA la reconstruirá en 4K HD.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden
              ${imagePreview ? 'border-purple-300 bg-purple-50' : 'border-stone-200 hover:border-purple-300 hover:bg-stone-50'}
            `}
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <div className="relative z-10 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                   <span className="text-xs font-bold text-purple-700 flex items-center gap-2">
                     <Check className="w-3 h-3" /> Imagen cargada
                   </span>
                </div>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-stone-300 mb-2" />
                <span className="text-xs text-stone-400 uppercase tracking-wider">Toca para subir</span>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleEnhance}
            disabled={!imagePreview || isAnalyzing}
            className="w-full py-4 bg-ink text-white rounded-xl font-sans text-xs uppercase tracking-widest hover:bg-purple-900 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analizando & Reconstruyendo...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Restaurar a 4K
              </>
            )}
          </button>
          
          <p className="text-[10px] text-stone-300 text-center mx-auto max-w-[240px]">
            *Solo funciona con notas de texto. Las selfies u otras fotos serán rechazadas automáticamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QualityEnhancer;