
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from './PRODUCTS';

const CATEGORIES = ['Todos', 'Estética', 'Academias', 'Automotiva', 'Mecânica', 'Especiais', 'Portfolio', 'Loja de Construcao', 'Imobiliária', 'Restaurante', 'Saúde', 'Educação', 'Tecnologia', 'Moda', 'Beleza', 'Fitness', 'Viagens', 'Eventos'];

// --- COMPONENTS ---
const Icon = ({ name, className = "w-5 h-5" }) => {
  useEffect(() => {
    // @ts-ignore
    if (window.lucide) window.lucide.createIcons();
  }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

const App = () => {
  const [filter, setFilter] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'Olá! Sou seu assistente de projetos. Qual tipo de site você está precisando hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchesFilter = filter === 'Todos' || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm]);

  const handleAiConsultant = async () => {
    if (!input.trim() || isLoading) return;
    const apiKey = process.env.API_KEY;
    if (!apiKey) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Você é um consultor de vendas de sites. Sugira uma das categorias (${CATEGORIES.join(', ')}) com base no pedido: ${userMsg}. Seja breve e persuasivo.`,
      });
      setMessages(prev => [...prev, { role: 'ai', content: response.text || 'Entendido! Como posso ajudar mais?' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Desculpe, tive um erro de conexão.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full glass border-b border-slate-800/50 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Icon name="layout" className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-white leading-tight">Elite Sites</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Portfolio de Vendas</p>
          </div>
        </div>

        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-400">
            <Icon name="search" className="w-4 h-4" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar site ou nicho..."
            className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 transition-all focus:ring-2 focus:ring-indigo-500/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button 
          onClick={() => window.open('https://wa.me/SEU_NUMERO', '_blank')}
          className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-600/20"
        >
          <Icon name="message-circle" className="w-4 h-4" />
          Falar com Consultor
        </button>
      </header>

      {/* CATEGORY BAR */}
      <div className="p-4 md:px-8 border-b border-slate-800 bg-slate-900/30 flex gap-2 overflow-x-auto custom-scrollbar no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              filter === cat 
                ? 'bg-indigo-600 border-indigo-500 text-white' 
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Landing Pages de Alta Conversão</h2>
          <p className="text-slate-400 max-w-2xl">Sites profissionais prontos para o seu negócio. Design moderno, responsividade total e performance garantida.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="group glass-card bg-slate-900/40 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-all hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Icon name={product.icon} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter bg-slate-800 text-slate-400 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>

              <h3 className="font-bold text-lg text-white mb-1 group-hover:text-indigo-400 transition-colors">{product.name}</h3>
              <p className="text-slate-500 text-xs mb-6">Template otimizado para SEO e conversão imediata.</p>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.open(product.url, '_blank')}
                  className="flex-1 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-600/30 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Icon name="external-link" className="w-4 h-4" />
                  Ver Demo
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <Icon name="search-x" className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-slate-400 font-medium">Nenhum site encontrado para esta busca.</h3>
          </div>
        )}
      </main>

      {/* FLOATING AI ASSISTANT BUTTON */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 rounded-full shadow-2xl shadow-indigo-600/40 flex items-center justify-center text-white z-50 hover:scale-110 active:scale-95 transition-all"
      >
        <Icon name={isChatOpen ? "x" : "bot"} />
      </button>

      {/* AI SIDE PANEL */}
      {isChatOpen && (
        <div className="fixed inset-y-0 right-0 w-full md:w-96 glass-strong z-50 border-l border-slate-800 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl bg-slate-950/95 backdrop-blur-xl">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div>
              <h3 className="font-bold text-white">Consultor IA</h3>
              <p className="text-[10px] text-indigo-400 font-bold uppercase">Powered by Gemini</p>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white p-1">
              <Icon name="chevron-right" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && <div className="text-slate-500 text-xs animate-pulse">Consultando catálogos...</div>}
          </div>

          <div className="p-4 border-t border-slate-800">
            <div className="relative">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiConsultant()}
                placeholder="Ex: Qual site serve para dentista?"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm outline-none focus:border-indigo-500"
              />
              <button 
                onClick={handleAiConsultant}
                className="absolute right-2 top-2 w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white"
              >
                <Icon name="arrow-right" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-auto p-8 border-t border-slate-900 bg-slate-950/50 text-center">
        <p className="text-slate-500 text-xs">© 2024 Elite Sites Portfolio • Todos os direitos reservados</p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
