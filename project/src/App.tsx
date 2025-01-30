import React, { useState, useCallback } from 'react';
import { Upload, Download, Image as ImageIcon, Loader2, Sun, Moon } from 'lucide-react';
import { ParticleBackground } from './components/ParticleBackground';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, setTheme } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setIsComplete(false);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const processImage = useCallback(() => {
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <ParticleBackground theme={theme} />
      
      <div className="container mx-auto px-4 py-8 relative">
        <button
          onClick={toggleTheme}
          className={`fixed top-4 right-4 p-2 rounded-full ${
            theme === 'dark' 
              ? 'bg-gray-800 hover:bg-gray-700' 
              : 'bg-white hover:bg-gray-100 shadow-lg'
          }`}
        >
          {theme === 'dark' ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-600" />
          )}
        </button>

        <header className="text-center mb-12 relative z-10">
          <div className="flex items-center justify-center mb-4">
            <ImageIcon className={`w-12 h-12 ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          <h1 className="text-4xl font-bold mb-2">ImageEnhance AI</h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Transform your images into stunning HD quality
          </p>
        </header>

        <div className={`max-w-3xl mx-auto rounded-xl shadow-2xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-center w-full">
                <label className={`w-full flex flex-col items-center px-4 py-6 rounded-lg shadow-lg tracking-wide border cursor-pointer transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-blue-400 border-blue-400 hover:bg-gray-600'
                    : 'bg-gray-50 text-blue-600 border-blue-600 hover:bg-gray-100'
                }`}>
                  <Upload className="w-8 h-8" />
                  <span className="mt-2 text-base">Select an image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            {selectedImage && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className={`text-center mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Original</h3>
                    <img
                      src={selectedImage}
                      alt="Original"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                  <div className={`p-4 rounded-lg ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <h3 className={`text-center mb-2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Enhanced</h3>
                    <div className={`w-full h-48 rounded-lg flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'
                    }`}>
                      {isComplete ? (
                        <img
                          src={selectedImage}
                          alt="Enhanced"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      ) : (
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Processing result will appear here
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={processImage}
                    disabled={isProcessing || isComplete}
                    className={`px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${
                      theme === 'dark'
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4" />
                        Enhance Image
                      </>
                    )}
                  </button>
                  {isComplete && (
                    <button
                      onClick={() => {}}
                      className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                        theme === 'dark'
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <Download className="w-4 h-4" />
                      Download HD
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center">
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Note: This is a demo interface. Actual image enhancement would require server-side processing.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;