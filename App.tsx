
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { placeProductInScene } from './services/geminiService';
import { ImageUpload } from './components/ImageUpload';
import { StoryPreview } from './components/StoryPreview';
import { Loader } from './components/Loader';
import { SparklesIcon, DownloadIcon } from './components/Icons';

// To inform TypeScript about the global html2canvas library
declare const html2canvas: any;

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

function App() {
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productName, setProductName] = useState('');
  
  const [processedProductImage, setProcessedProductImage] = useState<string | null>(null);
  const [processedLogo, setProcessedLogo] = useState<string | null>(null);
  const [processedQrCode, setProcessedQrCode] = useState<string | null>(null);

  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isProcessingLogo, setIsProcessingLogo] = useState(false);
  const [isProcessingQrCode, setIsProcessingQrCode] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLogo = localStorage.getItem('bisha-market-logo');
    if (savedLogo) setProcessedLogo(savedLogo);

    const savedQrCode = localStorage.getItem('bisha-market-qrcode');
    if (savedQrCode) setProcessedQrCode(savedQrCode);
  }, []);

  const handleGenerateClick = useCallback(async () => {
    if (!productImageFile || !productName) {
      setError('الرجاء رفع صورة المنتج وكتابة اسمه.');
      return;
    }

    setIsGeneratingStory(true);
    setError(null);
    setProcessedProductImage(null);

    try {
      const b64Data = await placeProductInScene(productImageFile);
      setProcessedProductImage(`data:image/png;base64,${b64Data}`);
    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء إنشاء صورة المنتج. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsGeneratingStory(false);
    }
  }, [productImageFile, productName]);
  
  const handleDownloadClick = useCallback(async () => {
    if (!storyRef.current) return;
    try {
      const canvas = await html2canvas(storyRef.current, {
        useCORS: true,
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `${productName.replace(/ /g, '_')}_story.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
      setError("لم نتمكن من تحميل الصورة. حاول مرة أخرى.");
    }
  }, [productName]);

  const createSelectAndSaveHandler = (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setResult: React.Dispatch<React.SetStateAction<string | null>>,
    storageKey: string,
    assetName: string
  ) => async (file: File | null) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      setResult(dataUrl);
      localStorage.setItem(storageKey, dataUrl);
    } catch (err) {
      console.error(`Error processing ${assetName}:`, err);
      setError(`حدث خطأ أثناء معالجة ${assetName}. حاول مرة أخرى.`);
    } finally {
      setLoading(false);
    }
  };

  const createClearHandler = (
    setter: React.Dispatch<React.SetStateAction<string | null>>,
    storageKey: string
  ) => () => {
    setter(null);
    localStorage.removeItem(storageKey);
  };
  
  const handleLogoSelect = createSelectAndSaveHandler(setIsProcessingLogo, setProcessedLogo, 'bisha-market-logo', 'الشعار');
  const handleQrCodeSelect = createSelectAndSaveHandler(setIsProcessingQrCode, setProcessedQrCode, 'bisha-market-qrcode', 'الباركود');
  const handleClearLogo = createClearHandler(setProcessedLogo, 'bisha-market-logo');
  const handleClearQrCode = createClearHandler(setProcessedQrCode, 'bisha-market-qrcode');

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 p-4 sm:p-8" style={{ fontFamily: "'Tajawal', sans-serif" }}>
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10 border-b border-stone-700 pb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">مولّد قصص سوق بيشه</h1>
          <p className="text-stone-400 mt-2">صمم قصص انستغرام احترافية لمنتجاتك بضغطة زر</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-stone-800/50 p-6 rounded-2xl shadow-lg border border-stone-700 flex flex-col gap-6">
            <div>
              <label className="block text-lg font-semibold mb-2 text-amber-300">1. ارفع صورة المنتج (مطلوب)</label>
              <ImageUpload onImageSelect={setProductImageFile} />
            </div>
            
            <div>
              <label htmlFor="productName" className="block text-lg font-semibold mb-2 text-amber-300">2. اكتب اسم المنتج (مطلوب)</label>
              <input
                id="productName"
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="مثال: عسل سدر جبلي"
                className="w-full bg-stone-700 border border-stone-600 rounded-lg p-3 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition duration-200 text-white placeholder-stone-500"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2 text-amber-300">3. ارفع شعار المتجر (اختياري)</label>
              <p className="text-xs text-stone-400 mb-2 -mt-2">سيتم حفظ الشعار تلقائياً للمرات القادمة.</p>
              <ImageUpload onImageSelect={handleLogoSelect} previewUrl={processedLogo} onClear={handleClearLogo} isLoading={isProcessingLogo} />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2 text-amber-300">4. ارفع باركود الموقع (اختياري)</label>
              <p className="text-xs text-stone-400 mb-2 -mt-2">سيتم حفظ الباركود تلقائياً للمرات القادمة.</p>
              <ImageUpload onImageSelect={handleQrCodeSelect} previewUrl={processedQrCode} onClear={handleClearQrCode} isLoading={isProcessingQrCode} />
            </div>

            <button
              onClick={handleGenerateClick}
              disabled={isGeneratingStory || !productImageFile || !productName}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-400 to-yellow-600 text-stone-900 font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:from-amber-500 hover:to-yellow-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-4"
            >
              {isGeneratingStory ? (
                <>
                  <Loader />
                  جاري المعالجة...
                </>
              ) : (
                <>
                  <SparklesIcon />
                  إنشاء القصة
                </>
              )}
            </button>
            {error && <p className="text-red-400 text-center">{error}</p>}
          </div>
          
          <div className="bg-stone-800/50 p-4 rounded-2xl shadow-lg border border-stone-700 flex flex-col justify-center items-center min-h-[60vh] gap-4">
            {isGeneratingStory ? (
              <div className="flex flex-col items-center text-center text-stone-400">
                <Loader />
                <p className="mt-4 text-lg">يقوم الذكاء الاصطناعي بإنشاء المشهد...</p>
                <p className="text-sm">قد يستغرق هذا بضع لحظات.</p>
              </div>
            ) : (
              <>
                <StoryPreview
                  ref={storyRef}
                  productImage={processedProductImage}
                  productName={productName}
                  logoImage={processedLogo}
                  qrCodeImage={processedQrCode}
                />
                {processedProductImage && (
                  <button
                    onClick={handleDownloadClick}
                    className="w-full max-w-xs mt-4 flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md"
                  >
                    <DownloadIcon />
                    تحميل الصورة
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;