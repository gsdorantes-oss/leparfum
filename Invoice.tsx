
import React from 'react';
import { Sale, Customer } from '../types';

interface InvoiceProps {
  sale: Sale;
  customer: Customer;
  onClose: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ sale, customer, onClose }) => {
  const shareWhatsApp = () => {
    const text = `*ESSENCEFLOW - Factura Digital*%0A%0AHola ${customer.name}, gracias por tu compra.%0A%0A*Detalles:*%0AFragancia: ${sale.perfume_name}%0APresentación: ${sale.type}%0AMétodo de Pago: ${sale.payment_method}%0A%0A*Total: $${sale.price.toFixed(2)}*%0A%0AFactura Nro: ${sale.id}%0AFecha: ${new Date(sale.date).toLocaleString()}`;
    window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const shareEmail = () => {
    const subject = `Tu recibo de EssenceFlow - ${sale.perfume_name}`;
    const body = `Hola ${customer.name},\n\nGracias por confiar en EssenceFlow.\n\nDetalles de tu compra:\n- Fragancia: ${sale.perfume_name}\n- Presentación: ${sale.type}\n- Método de pago: ${sale.payment_method}\n- Total: $${sale.price.toFixed(2)}\n\nFactura ID: ${sale.id}\nFecha: ${new Date(sale.date).toLocaleString()}`;
    window.open(`mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Invoice Header */}
        <div className="bg-slate-900 text-center py-10 px-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white text-2xl">&times;</button>
          <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg">✨</div>
          <h2 className="text-amber-400 font-serif tracking-widest text-xl uppercase">EssenceFlow</h2>
          <p className="text-slate-400 text-xs mt-1">Recibo de Compra Digital</p>
        </div>

        {/* Invoice Content */}
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start border-b border-slate-100 pb-4">
             <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Cliente</p>
                <p className="text-sm font-bold text-slate-800">{customer.name}</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Fecha</p>
                <p className="text-[10px] font-bold text-slate-800">{new Date(sale.date).toLocaleDateString()}</p>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">{sale.perfume_name}</p>
                <p className="text-xs text-slate-500">Presentación: {sale.type}</p>
              </div>
              <p className="font-bold text-slate-800">${sale.price.toFixed(2)}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
               <p className="text-xs font-bold text-slate-500 uppercase">Total Pagado</p>
               <p className="text-2xl font-bold text-emerald-600">${sale.price.toFixed(2)}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg text-center">
               <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Pagado con</p>
               <p className="text-xs font-bold text-slate-700">{sale.payment_method}</p>
            </div>
          </div>

          <p className="text-[10px] text-center text-slate-400 italic">ID: {sale.id}</p>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button 
              onClick={shareWhatsApp}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-green-500/20"
            >
              <span>WhatsApp</span>
            </button>
            <button 
              onClick={shareEmail}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20"
            >
              <span>Email</span>
            </button>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full text-slate-400 text-xs font-bold hover:text-slate-600"
          >
            Listo, cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
