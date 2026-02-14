
import React from 'react';
import { Perfume, Sale } from '../types';

interface DashboardProps {
  perfumes: Perfume[];
  sales: Sale[];
}

const Dashboard: React.FC<DashboardProps> = ({ perfumes, sales }) => {
  const totalStockMl = perfumes.reduce((acc, p) => acc + p.current_ml, 0);
  const lowStock = perfumes.filter(p => p.current_ml < (p.total_ml * 0.2) || p.stock_bottles <= 1);
  const slowMoving = perfumes.filter(p => {
    if (!p.last_sold_date) return true;
    const lastDate = new Date(p.last_sold_date);
    const diff = Date.now() - lastDate.getTime();
    return diff > (30 * 24 * 60 * 60 * 1000); // More than 30 days
  });

  const totalRevenue = sales.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ventas Totales" value={`$${totalRevenue.toFixed(2)}`} icon="💵" color="bg-emerald-500" />
        <StatCard title="Total ML en Stock" value={`${totalStockMl} ml`} icon="💧" color="bg-blue-500" />
        <StatCard title="Perfumes Activos" value={perfumes.length.toString()} icon="✨" color="bg-purple-500" />
        <StatCard title="Ventas Realizadas" value={sales.length.toString()} icon="🛒" color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="text-red-500">⚠️</span> Agotándose / Renovación
            </h3>
          </div>
          <div className="space-y-4">
            {lowStock.length > 0 ? (
              lowStock.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="font-semibold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">{p.current_ml} ml restantes</p>
                    <p className="text-xs text-slate-400">{p.stock_bottles} unidades cerradas</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">Todo el inventario está en niveles óptimos.</p>
            )}
          </div>
        </div>

        {/* Slow Moving Items */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="text-slate-500">💤</span> Artículos de baja rotación
            </h3>
          </div>
          <div className="space-y-4">
            {slowMoving.length > 0 ? (
              slowMoving.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 italic">No se vende desde hace 30+ días</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">Todos tus productos se están moviendo bien.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
    <div className={`w-12 h-12 ${color} text-white rounded-lg flex items-center justify-center text-2xl shadow-inner`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;
