
import React, { useState } from 'react';
import { Customer } from '../types';

interface CustomersProps {
  customers: Customer[];
  onAdd: (c: Customer) => void;
}

const Customers: React.FC<CustomersProps> = ({ customers, onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ ...formData, id: crypto.randomUUID() });
    setShowModal(false);
    setFormData({ name: '', phone: '', email: '' });
  };

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="bg-slate-900 hover:bg-black text-white px-6 py-2 rounded-lg font-bold shadow-md transition-all"
        >
          + Nuevo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(c => (
          <div key={c.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all relative group">
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-xl">👤</div>
               <div>
                  <h4 className="font-bold text-slate-800">{c.name}</h4>
                  <p className="text-xs text-slate-500">{c.phone}</p>
               </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
               <p className="text-xs text-slate-400 truncate">{c.email}</p>
               <button className="text-amber-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Ver historial</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-serif">Añadir Cliente</h3>
              <button onClick={() => setShowModal(false)} className="text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre Completo</label>
                <input required className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">WhatsApp / Teléfono</label>
                <input required className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+58..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Correo Electrónico</label>
                <input type="email" required className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-4 bg-amber-600 text-white rounded-xl font-bold shadow-lg mt-4">Guardar Cliente</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
