import React, { forwardRef } from 'react';
import { LOGO_BASE64, QR_CODE_BASE64 } from '../constants';

interface StoryPreviewProps {
  productImage: string | null;
  productName: string;
  logoImage: string | null;
  qrCodeImage: string | null;
}

export const StoryPreview = forwardRef<HTMLDivElement, StoryPreviewProps>(
  ({ productImage, productName, logoImage, qrCodeImage }, ref) => {
    const showPlaceholder = !productImage || !productName;

    const finalLogo = logoImage || `data:image/png;base64,${LOGO_BASE64}`;
    const finalQrCode = qrCodeImage || `data:image/png;base64,${QR_CODE_BASE64}`;

    return (
      <div className="flex flex-col items-center gap-4 w-full">
        {productImage && <p className="text-lg font-semibold text-stone-300">تم إنشاء المعاينة بنجاح!</p>}
        <div
          ref={ref}
          className="relative w-[300px] h-[533px] bg-gradient-to-b from-[#422d1a] to-[#1c1917] text-white overflow-hidden shadow-2xl rounded-xl"
        >
          {showPlaceholder ? (
            <>
              <div className="w-full h-full border-2 border-dashed border-stone-600/50 rounded-xl relative overflow-hidden">
                {/* Skeleton for Logo */}
                <div className="absolute top-10 inset-x-0 mx-auto w-24 h-24 bg-stone-600/50 rounded-full animate-pulse"></div>
                
                {/* Skeleton for Image */}
                <div className="absolute top-40 bottom-48 inset-x-0 mx-auto w-[80%] bg-stone-600/50 rounded-lg animate-pulse"></div>
                
                {/* Skeleton for Title Area */}
                <div className="absolute bottom-[120px] left-0 right-0 px-4 flex flex-col items-center gap-3">
                    <div className="h-px bg-stone-600/50 rounded w-2/3 animate-pulse"></div>
                    <div className="h-10 bg-stone-600/50 rounded w-3/4 animate-pulse"></div>
                </div>
                
                {/* Skeleton for Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-stone-800/20">
                    <div className="w-20 h-20 bg-stone-600/50 rounded-lg animate-pulse"></div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="h-4 bg-stone-600/50 rounded w-24 animate-pulse"></div>
                        <div className="h-4 bg-stone-600/50 rounded w-32 animate-pulse"></div>
                    </div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-stone-500 px-4">
                  <h3 className="text-xl font-bold mb-2">معاينة التصميم</h3>
                  <p className="text-sm">ستظهر نتيجة تصميمك هنا بعد الإنشاء.</p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Backgrounds */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#5c3d2e] via-[#422d1a] to-[#1c1917]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-yellow-500/10 to-transparent rounded-full blur-3xl"></div>
              
              {/* Logo */}
              <div className="absolute top-10 inset-x-0 z-20 flex justify-center">
                <img 
                  src={finalLogo} 
                  alt="شعار سوق بيشه" 
                  className="w-24 h-24 object-cover rounded-full drop-shadow-lg"
                />
              </div>
              
              {/* Main Content Area (Image + Name) */}
              <div className="absolute top-36 bottom-32 inset-x-0 flex flex-col items-stretch justify-center p-4 gap-4 z-10">
                {/* Image Container */}
                <div className="flex-1 flex items-center justify-center min-h-0 relative">
                  <div className="absolute w-[90%] h-[90%] bg-gradient-radial from-amber-400/20 via-transparent to-transparent rounded-[50%] blur-3xl opacity-80"></div>
                  <img
                    src={productImage}
                    alt={productName}
                    className="max-w-full max-h-full object-contain drop-shadow-2xl relative z-10 filter brightness-110 contrast-110"
                  />
                </div>
                 {/* Product Name Container */}
                <div className="flex-shrink-0 text-center flex flex-col items-center">
                    <div className="w-2/3 h-[2px] bg-gradient-to-r from-amber-400 to-yellow-500 mb-4 rounded-full"></div>
                    <h1 
                      className="text-4xl font-black text-white drop-shadow-xl leading-tight"
                      style={{ fontWeight: 900, textShadow: '2px 2px 5px rgba(0,0,0,0.5)' }}
                    >
                      {productName}
                    </h1>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-black/20 backdrop-blur-sm border-t border-white/10">
                <img 
                  src={finalQrCode} 
                  alt="QR Code" 
                  className="w-20 h-20 rounded-lg shadow-lg object-contain bg-white p-1" 
                />
                <div className="text-right flex flex-col items-end">
                  <h3 className="font-bold text-amber-100/90 text-lg">سوق بيشه المركزي</h3>
                  <p className="text-base text-white/90 -mt-1">شرق الأحمدي</p>
                  <p 
                    className="text-lg font-semibold tracking-wider text-white/90 mt-1" 
                    style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
                  >
                    <span dir="ltr" style={{display: 'inline-block'}}>50703093 - 94020643</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
);