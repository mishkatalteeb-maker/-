
import React, { useState, useRef, useEffect } from 'react';
import { Loader } from './Loader';
import { UploadIcon, XCircleIcon } from './Icons';

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void;
  previewUrl?: string | null;
  onClear?: () => void;
  isLoading?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, previewUrl, onClear, isLoading }) => {
  const [internalPreview, setInternalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!previewUrl) {
      setInternalPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
        setInternalPreview(previewUrl);
    }
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInternalPreview(reader.result as string);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
    } else {
      setInternalPreview(null);
      onImageSelect(null);
    }
  };

  const handleClick = () => {
    if (isLoading) return;
    fileInputRef.current?.click();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setInternalPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onImageSelect(null);
    if (onClear) {
      onClear();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`w-full p-4 border-2 border-dashed border-stone-600 rounded-lg transition-all duration-300 min-h-[150px] flex items-center justify-center ${isLoading ? 'cursor-wait bg-stone-700/50' : 'cursor-pointer hover:border-amber-400 hover:bg-stone-700/50'}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={isLoading}
      />
      {isLoading ? (
        <div className="flex flex-col items-center text-stone-400">
          <Loader />
          <p className="mt-2">جاري المعالجة...</p>
        </div>
      ) : internalPreview ? (
        <div className="relative group flex flex-col items-center text-center">
          <img src={internalPreview} alt="Preview" className="max-h-48 rounded-md object-contain" />
          <p className="mt-2 text-xs text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">لتغيير الصورة، انقر هنا.</p>
          {onClear && (
            <button
              onClick={handleClear}
              className="absolute -top-2 -right-2 bg-stone-800 rounded-full text-stone-400 hover:text-white hover:bg-red-600 transition-all duration-200"
              aria-label="إزالة الصورة"
            >
              <XCircleIcon />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-stone-400 py-8">
          <UploadIcon />
          <p className="mt-2 font-semibold">انقر هنا لرفع الصورة</p>
          <p className="text-sm">PNG, JPG, WEBP</p>
        </div>
      )}
    </div>
  );
};
