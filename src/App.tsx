import React, { useState, useCallback } from 'react';
import { MemeCategory, GenerationState } from './types';
import { generateMeme } from './geminiService';
import { MemeCard } from './components/MemeCard'; // Changed component
import { Sparkles, Palette, Laugh, AlertCircle, Share2, Download, Loader2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

const CATEGORIES = Object.values(MemeCategory);

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<MemeCategory>(MemeCategory.FunkyBhai);
  const [isDownloading, setIsDownloading] = useState(false);
  const [state, setState] = useState<GenerationState>({
    loading: false,
    error: null,
    data: null,
  });

  const handleGenerate = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await generateMeme(selectedCategory);
      setState({
        loading: false,
        error: null,
        data: result,
      });
    } catch (err) {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : 'An unknown error occurred',
        data: null,
      });
    }
  }, [selectedCategory]);

  const handleDownload = async () => {
    const element = document.getElementById('meme-card-capture'); // Changed ID
    if (!element || !state.data) return;
    
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      const filename = `saatmishaali-${state.data.category.toLowerCase().replace(/\s+/g, '-')}-meme.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
      alert("Something went wrong while generating the image. Please try again or take a screenshot.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!state.data) return;
    const text = `${state.data.text} - via Saatmishaali AI`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Saatmishaali Meme',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Meme copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 text-teal-800 selection:bg-orange-200 selection:text-orange-900">
      {/* Navbar */}
      <nav className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-2">
              <img
                src="/saatmishaali-logo.png" // Update logo path
                alt="Saatmishaali Logo"
                className="opacity-90"
                style={{
                  width: '42px',
                  height: '35px',
                }}
              />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-teal-800">
              Saatmishaali <span className="text-orange-600">AI</span>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-500">
            <a href="#" className="hover:text-orange-600 transition-colors">Categories</a>
            <a href="#" className="hover:text-orange-600 transition-colors">Templates</a>
            <a href="#" className="hover:text-orange-600 transition-colors">About</a>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Controls Column */}
          <div className="space-y-8">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-full">
                <Laugh size={14} />
                Authentic Bengali Memes
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-teal-800 leading-[1.1]">
                Stop searching. <br />
                <span className="text-orange-600">Start generating.</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-md">
                Create original, hilarious Bengali memes in seconds. Perfect for Facebook, WhatsApp, or Instagram.
              </p>
            </header>

            <section className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <Palette size={14} />
                  Choose Meme Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        px-4 py-3 rounded-lg text-sm font-medium border transition-all duration-200 text-left
                        ${selectedCategory === category 
                          ? 'bg-teal-800 border-teal-800 text-white shadow-lg ring-2 ring-orange-500 ring-offset-2' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}
                      `}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={state.loading}
                className="w-full py-4 bg-orange-600 hover:bg-teal-800 disabled:bg-slate-300 text-white rounded-xl font-bold text-lg shadow-xl shadow-orange-200 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                {state.loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Generating Meme...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                    Generate Bengali Meme
                  </>
                )}
              </button>

              {state.error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={20} className="shrink-0" />
                  <p className="text-sm font-medium">{state.error}</p>
                </div>
              )}
            </section>
          </div>

          {/* Preview Column */}
          <div className="flex flex-col items-center gap-8 sticky top-32">
            <div className="w-full flex justify-center">
              <MemeCard 
                data={state.data} 
                loading={state.loading} 
                id="meme-card-capture"
              />
            </div>

            {state.data && !state.loading && (
              <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4">
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Download PNG
                    </>
                  )}
                </button>
                <button 
                  onClick={handleShare}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-full shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                  <Share2 size={18} />
                  Share Meme
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/50 py-12 mt-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2 opacity-60 grayscale hover:grayscale-0 transition-all">
              <span className="font-bold text-lg text-teal-800">Saatmishaali AI</span>
            </div>
            <p className="text-xs text-slate-400">© 2026 Built for developers by DevZodiac Inc.</p>
          </div>
          <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-teal-800 transition-colors">GitHub</a>
            <a href="#" className="hover:text-teal-800 transition-colors">Privacy</a>
            <a href="#" className="hover:text-teal-800 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;