
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: '📊' },
    { id: 'inventory', label: 'Inventario', icon: '💎' },
    { id: 'sales', label: 'Ventas y Factura', icon: '💰' },
    { id: 'customers', label: 'Clientes', icon: '👤' },
  ];

  return (
    <aside className={`
      w-64 bg-slate-900 text-white fixed h-full flex flex-col z-50 transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      lg:translate-x-0
    `}>
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif tracking-widest text-amber-400">ESSENCEFLOW</h2>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Luxury Fragrance ERP</p>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-900 shadow-lg">A</div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold truncate">Administrador</p>
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-tighter">Socio Premium</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
