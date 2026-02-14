
import React, { useState } from 'react';
import { Perfume, Customer, Sale, SaleType, PaymentMethod } from '../types';
import Invoice from './Invoice';

interface SalesProps {
  perfumes: Perfume[];
  customers: Customer[];
  sales: Sale[];
  onAddSale: (sale: Sale) => void;
}

const Sales: React.FC<SalesProps> = ({ perfumes, customers, sales, onAddSale }) => {
  const [selectedPerfumeId, setSelectedPerfumeId] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [saleType, setSaleType] = useState<SaleType>(SaleType.ML10);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [showInvoice, setShowInvoice] = useState<Sale | null>(null);

  const handleProcessSale = () => {
    const perfume = perfumes.find(p => p.id === selectedPerfumeId);
    const customer = customers.find(c => c.id === selectedCustomerId);

    if (!perfume || !customer) {
      alert('Por favor selecciona un perfume y un cliente');
      return;
    }

    let price = 0;
    if (saleType === SaleType.FULL) price = perfume.price_full;
    else if (saleType === SaleType.ML10) price = perfume.price_10ml;
    else if (saleType === SaleType.ML5) price = perfume.price_5ml;

    const newSale: Sale = {
      id: `FAC-${Date.now()}`,
      perfume_id: perfume.id,
      perfume_name: perfume.name,
      customer_id: customer.id,
      customer_name: customer.name,
      type: saleType,
      amount: 1,
      price: price,
      payment_method: paymentMethod,
      date: new Date().toISOString()
    };

    onAddSale(newSale);
    setShowInvoice(newSale);
    setSelectedPerfumeId('');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
      <div className="xl:col-span-2 space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
            <span className="p-2 bg-amber-100 rounded-lg text-lg">🛒</span> Terminal de Venta
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Elegir Fragancia</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium text-slate-900"
                  value={selectedPerfumeId}
                  onChange={e => setSelectedPerfumeId(e.target.value)}
                >
                  <option value="" className="text-slate-400">Buscar fragancia...</option>
                  {perfumes.map(p => (
                    <option key={p.id} value={p.id} className="text-slate-900">{p.name} ({p.current_ml}ml / {p.stock_bottles}uds)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Elegir Cliente</label>
                <select 
                  className="w-full border border-slate-200 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium text-slate-900"
                  value={selectedCustomerId}
                  onChange={e => setSelectedCustomerId(e.target.value)}
                >
                  <option value="" className="text-slate-400">Buscar cliente...</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id} className="text-slate-900">{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Presentación de la Venta</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: SaleType.FULL, label: 'Botella Sellada', icon: '📦' },
                    { id: SaleType.ML10, label: 'Decant 10ml', icon: '🧪' },
                    { id: SaleType.ML5, label: 'Decant 5ml', icon: '💧' },
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSaleType(type.id as SaleType)}
                      className={`p-3 rounded-xl border-2 flex items-center justify-between transition-all ${
                        saleType === type.id 
                          ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-sm' 
                          : 'border-slate-100 hover:border-slate-200 text-slate-500 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{type.icon}</span>
                        <span className="text-xs font-bold uppercase">{type.label}</span>
                      </div>
                      {saleType === type.id && <span className="text-amber-500">●</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Forma de Pago</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(PaymentMethod).map(method => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl border-2 transition-all text-xs font-bold uppercase tracking-tighter ${
                      paymentMethod === method 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                        : 'bg-white text-slate-500 border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <button 
              onClick={handleProcessSale}
              className="w-full bg-gradient-to-r from-slate-800 to-black hover:from-black hover:to-slate-800 text-white py-5 rounded-2xl font-bold text-lg shadow-2xl transition-all active:scale-[0.98]"
            >
              Generar Venta & Recibo Digital
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
             <h4 className="font-bold text-slate-700 uppercase text-[10px] tracking-widest">Actividad Reciente</h4>
             <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-400">{sales.length} registros</span>
           </div>
           <div className="max-h-[350px] overflow-y-auto no-scrollbar">
              <table className="w-full">
                <tbody className="divide-y divide-slate-50">
                   {sales.length === 0 ? (
                     <tr><td className="p-10 text-center text-slate-400 text-xs italic">Aún no hay ventas registradas</td></tr>
                   ) : sales.map(s => (
                     <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm group-hover:bg-white group-hover:shadow-sm">💎</div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm leading-none">{s.perfume_name}</p>
                              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter font-semibold">{s.customer_name} • {s.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-bold text-emerald-600">${s.price.toFixed(2)}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(s.date).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => setShowInvoice(s)} className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all">
                             <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                        </td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-amber-600 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 transition-transform group-hover:scale-110">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2z"/></svg>
           </div>
           <p className="text-amber-100 text-[10px] font-bold uppercase tracking-widest mb-1">Corte de Caja Diario</p>
           <h3 className="text-4xl font-serif mb-6">$ {sales.filter(s => new Date(s.date).toDateString() === new Date().toDateString()).reduce((acc, s) => acc + s.price, 0).toFixed(2)}</h3>
           <div className="space-y-3 border-t border-amber-500/50 pt-6">
             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-amber-100">
                <span>Ventas Hoy:</span>
                <span className="bg-white/20 px-2 py-1 rounded">{sales.filter(s => new Date(s.date).toDateString() === new Date().toDateString()).length}</span>
             </div>
             <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-amber-100">
                <span>Total Clientes:</span>
                <span>{customers.length}</span>
             </div>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 bg-slate-50 px-3 py-1 rounded-bl-xl text-[8px] font-black uppercase text-slate-400">Guía de Uso</div>
           <h4 className="font-bold text-slate-800 text-xs mb-4 uppercase tracking-widest">Tips de Operación</h4>
           <ul className="text-[10px] text-slate-500 space-y-4">
             <li className="flex gap-3 items-start"><span className="text-amber-500">●</span> Los decants se descuentan automáticamente del inventario líquido.</li>
             <li className="flex gap-3 items-start"><span className="text-amber-500">●</span> Al vender una botella cerrada, el stock de unidades disminuye.</li>
             <li className="flex gap-3 items-start"><span className="text-amber-500">●</span> Los recibos se sincronizan al instante en todos tus dispositivos.</li>
           </ul>
        </div>
      </div>

      {showInvoice && (
        <Invoice 
          sale={showInvoice} 
          customer={customers.find(c => c.id === showInvoice.customer_id)!} 
          onClose={() => setShowInvoice(null)} 
        />
      )}
    </div>
  );
};

export default Sales;
