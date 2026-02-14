
import React, { useState } from 'react';
import { Perfume } from '../types';

interface InventoryProps {
  perfumes: Perfume[];
  onAdd: (p: Perfume) => void;
  onUpdate: (p: Perfume) => void;
  onDelete: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ perfumes, onAdd, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Perfume | null>(null);

  const initialForm = {
    name: '',
    brand: '',
    total_ml: 100,
    current_ml: 100,
    price_full: 115,
    price_10ml: 13,
    price_5ml: 7,
    stock_bottles: 5,
  };

  const [formData, setFormData] = useState(initialForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      onUpdate({ ...editing, ...formData });
    } else {
      onAdd({
        ...formData,
        id: crypto.randomUUID(),
        current_ml: formData.total_ml,
      });
    }
    setShowModal(false);
    setEditing(null);
    setFormData(initialForm);
  };

  const startEdit = (p: Perfume) => {
    setEditing(p);
    setFormData({
      name: p.name,
      brand: p.brand,
      total_ml: p.total_ml,
      current_ml: p.current_ml,
      price_full: p.price_full,
      price_10ml: p.price_10ml,
      price_5ml: p.price_5ml,
      stock_bottles: p.stock_bottles,
    });
    setShowModal(true);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="hidden md:block">
          <p className="text-xs font-bold text-slate-400 uppercase">Resumen</p>
          <p className="text-sm font-bold text-slate-700">{perfumes.length} Fragancias en catálogo</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setEditing(null); }}
          className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
        >
          <span className="text-xl">+</span> Agregar Nueva
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-6 py-4">Fragancia</th>
                <th className="px-6 py-4 text-center">Nivel Líquido</th>
                <th className="px-6 py-4 text-center">Botellas Stock</th>
                <th className="px-6 py-4">Tarifario</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {perfumes.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg">🧪</div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none">{p.name}</p>
                        <p className="text-[10px] text-slate-400 uppercase mt-1 font-semibold">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className={`h-full transition-all duration-1000 ${p.current_ml / p.total_ml < 0.25 ? 'bg-red-500' : 'bg-blue-500'}`} 
                          style={{ width: `${(p.current_ml / p.total_ml) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[10px] font-bold mt-1 text-slate-500">{p.current_ml} ml / {p.total_ml} ml</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border ${p.stock_bottles > 2 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      {p.stock_bottles} UNIDADES
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[10px] space-y-1">
                      <div className="flex justify-between gap-4"><span className="text-slate-400">Full</span> <span className="font-bold text-slate-700">${p.price_full}</span></div>
                      <div className="flex justify-between gap-4"><span className="text-slate-400">10ml</span> <span className="font-bold text-slate-700">${p.price_10ml}</span></div>
                      <div className="flex justify-between gap-4"><span className="text-slate-400">5ml</span> <span className="font-bold text-slate-700">${p.price_5ml}</span></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(p)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button onClick={() => onDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-200 my-8">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-serif">{editing ? 'Editar Perfume' : 'Añadir Nueva Fragancia'}</h3>
              <button onClick={() => setShowModal(false)} className="text-2xl hover:text-amber-400 transition-colors">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Nombre Comercial</label>
                  <input required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-400" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Casa Perfumera</label>
                  <input required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 text-slate-900 placeholder:text-slate-400" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Capacidad Envase (ML)</label>
                  <input type="number" required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 text-slate-900" value={formData.total_ml} onChange={e => setFormData({...formData, total_ml: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Unidades Selladas</label>
                  <input type="number" required className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 text-slate-900" value={formData.stock_bottles} onChange={e => setFormData({...formData, stock_bottles: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                <p className="text-[10px] font-bold text-amber-600 uppercase mb-4 tracking-widest text-center underline">Tarifario de Venta ($)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                      <label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">Frasco Completo</label>
                      <input type="number" className="w-full border border-amber-200 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900" value={formData.price_full} onChange={e => setFormData({...formData, price_full: parseFloat(e.target.value)})} />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">Decant 10ml</label>
                      <input type="number" className="w-full border border-amber-200 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900" value={formData.price_10ml} onChange={e => setFormData({...formData, price_10ml: parseFloat(e.target.value)})} />
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">Decant 5ml</label>
                      <input type="number" className="w-full border border-amber-200 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-900" value={formData.price_5ml} onChange={e => setFormData({...formData, price_5ml: parseFloat(e.target.value)})} />
                   </div>
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-500 font-bold text-sm">Cancelar</button>
                <button type="submit" className="px-10 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl hover:bg-black transition-all">
                  {editing ? 'Guardar Cambios' : 'Registrar Fragancia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
