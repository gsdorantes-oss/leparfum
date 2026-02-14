
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Perfume, Customer, Sale, SaleType, PaymentMethod } from './types';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Customers from './components/Customers';
import Sidebar from './components/Sidebar';

// URL derivada del host de base de datos proporcionado por el usuario
// Nota: En un entorno real, estas serían variables de entorno.
const SUPABASE_URL = 'https://gvevwxsnztuhlodjlxdr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Placeholder, requiere la clave anon real

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'inventory' | 'sales' | 'customers'>('dashboard');
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Intentar cargar de Supabase (Si las claves son válidas)
      const { data: p } = await supabase.from('perfumes').select('*');
      const { data: c } = await supabase.from('customers').select('*');
      const { data: s } = await supabase.from('sales').select('*').order('date', { ascending: false });

      if (p) setPerfumes(p);
      if (c) setCustomers(c);
      if (s) setSales(s);

      // Fallback a LocalStorage para demostración si Supabase no responde (claves inválidas)
      if (!p) {
        const savedPerfumes = localStorage.getItem('ef_perfumes');
        const savedCustomers = localStorage.getItem('ef_customers');
        const savedSales = localStorage.getItem('ef_sales');
        if (savedPerfumes) setPerfumes(JSON.parse(savedPerfumes));
        if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
        if (savedSales) setSales(JSON.parse(savedSales));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPerfume = async (perfume: Perfume) => {
    setPerfumes([...perfumes, perfume]);
    localStorage.setItem('ef_perfumes', JSON.stringify([...perfumes, perfume]));
    await supabase.from('perfumes').insert([perfume]);
  };

  const updatePerfume = async (updated: Perfume) => {
    const newList = perfumes.map(p => p.id === updated.id ? updated : p);
    setPerfumes(newList);
    localStorage.setItem('ef_perfumes', JSON.stringify(newList));
    await supabase.from('perfumes').update(updated).eq('id', updated.id);
  };

  const deletePerfume = async (id: string) => {
    const newList = perfumes.filter(p => p.id !== id);
    setPerfumes(newList);
    localStorage.setItem('ef_perfumes', JSON.stringify(newList));
    await supabase.from('perfumes').delete().eq('id', id);
  };

  const addCustomer = async (customer: Customer) => {
    const newList = [...customers, customer];
    setCustomers(newList);
    localStorage.setItem('ef_customers', JSON.stringify(newList));
    await supabase.from('customers').insert([customer]);
  };

  const addSale = async (sale: Sale) => {
    const newSales = [sale, ...sales];
    setSales(newSales);
    localStorage.setItem('ef_sales', JSON.stringify(newSales));
    await supabase.from('sales').insert([sale]);

    // Update inventory logic
    const perfume = perfumes.find(p => p.id === sale.perfume_id);
    if (perfume) {
      const updatedPerfume = { ...perfume };
      if (sale.type === SaleType.FULL) {
        updatedPerfume.stock_bottles -= 1;
      } else if (sale.type === SaleType.ML10) {
        updatedPerfume.current_ml -= 10;
      } else if (sale.type === SaleType.ML5) {
        updatedPerfume.current_ml -= 5;
      }
      updatedPerfume.last_sold_date = new Date().toISOString();
      updatePerfume(updatedPerfume);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-serif tracking-widest text-amber-400">ESSENCEFLOW</h2>
        <p className="text-slate-400 text-sm animate-pulse">Sincronizando con la nube...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      {/* Overlay para móviles */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
        isOpen={isSidebarOpen}
      />
      
      <main className="flex-1 w-full lg:ml-64 p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 bg-white rounded-lg shadow-sm border border-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif text-slate-900 leading-tight">
                {activeTab === 'dashboard' && 'Panel de Control'}
                {activeTab === 'inventory' && 'Inventario'}
                {activeTab === 'sales' && 'Ventas'}
                {activeTab === 'customers' && 'Clientes'}
              </h1>
              <p className="text-slate-500 text-xs md:text-sm hidden md:block">Gestión de Fragancias de Lujo</p>
            </div>
          </div>
          <div className="flex items-center">
             <div className="bg-white p-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-2"></span>
                <span className="text-[10px] md:text-xs font-bold text-slate-600 px-2 uppercase tracking-tighter">Live Database</span>
             </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <Dashboard perfumes={perfumes} sales={sales} />}
          {activeTab === 'inventory' && <Inventory perfumes={perfumes} onAdd={addPerfume} onUpdate={updatePerfume} onDelete={deletePerfume} />}
          {activeTab === 'sales' && <Sales perfumes={perfumes} customers={customers} sales={sales} onAddSale={addSale} />}
          {activeTab === 'customers' && <Customers customers={customers} onAdd={addCustomer} />}
        </div>
      </main>
    </div>
  );
};

export default App;
