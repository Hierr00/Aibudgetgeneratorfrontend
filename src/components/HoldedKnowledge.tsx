import { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { getHoldedQuotes } from '../lib/holded';
import { Database, TrendingUp, Package, DollarSign } from 'lucide-react';

interface QuoteSummary {
  totalQuotes: number;
  totalRevenue: number;
  commonServices: Array<{ name: string; count: number; avgPrice: number }>;
  recentQuotes: Array<{
    id: string;
    contactName: string;
    date: string;
    total: number;
    items: number;
  }>;
}

export function HoldedKnowledge() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<QuoteSummary | null>(null);
  const [expanded, setExpanded] = useState(false);

  const analyzeQuotes = async () => {
    setLoading(true);
    try {
      const { quotes } = await getHoldedQuotes();

      if (!quotes || quotes.length === 0) {
        toast.info('Sin datos históricos', {
          description: 'No hay presupuestos en Holded todavía',
        });
        return;
      }

      // Analyze quotes
      const totalRevenue = quotes.reduce((sum: number, q: any) => sum + (q.total || 0), 0);
      
      // Extract common services
      const servicesMap = new Map<string, { count: number; totalPrice: number }>();
      
      quotes.forEach((quote: any) => {
        quote.items?.forEach((item: any) => {
          const name = item.name || 'Sin nombre';
          const current = servicesMap.get(name) || { count: 0, totalPrice: 0 };
          servicesMap.set(name, {
            count: current.count + 1,
            totalPrice: current.totalPrice + (item.price * item.units || 0),
          });
        });
      });

      const commonServices = Array.from(servicesMap.entries())
        .map(([name, data]) => ({
          name,
          count: data.count,
          avgPrice: data.totalPrice / data.count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Recent quotes
      const recentQuotes = quotes
        .sort((a: any, b: any) => (b.date || 0) - (a.date || 0))
        .slice(0, 5)
        .map((q: any) => ({
          id: q.id || q._id,
          contactName: q.contactName || 'Cliente',
          date: new Date(q.date).toLocaleDateString('es-ES'),
          total: q.total || 0,
          items: q.items?.length || 0,
        }));

      const summaryData: QuoteSummary = {
        totalQuotes: quotes.length,
        totalRevenue,
        commonServices,
        recentQuotes,
      };

      setSummary(summaryData);
      setExpanded(true);

      toast.success('Datos cargados', {
        description: `${quotes.length} presupuestos analizados`,
      });
    } catch (error: any) {
      toast.error('Error al cargar datos', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 p-4 border border-neutral-200 rounded-lg bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="size-4 text-neutral-950" />
          <h3 className="font-medium">Conocimiento Holded</h3>
        </div>
        <Button
          onClick={analyzeQuotes}
          disabled={loading}
          size="sm"
          variant="outline"
        >
          {loading ? 'Cargando...' : 'Cargar Datos'}
        </Button>
      </div>

      {summary && expanded && (
        <div className="space-y-3 pt-2 border-t border-neutral-200">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-2 text-neutral-500 text-xs mb-1">
                <Package className="size-3" />
                <span>Presupuestos</span>
              </div>
              <p className="text-lg font-medium text-neutral-950">
                {summary.totalQuotes}
              </p>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-2 text-neutral-500 text-xs mb-1">
                <DollarSign className="size-3" />
                <span>Ingresos Total</span>
              </div>
              <p className="text-lg font-medium text-neutral-950">
                {summary.totalRevenue.toFixed(2)}€
              </p>
            </div>
          </div>

          {/* Common Services */}
          {summary.commonServices.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-neutral-500 text-xs mb-2">
                <TrendingUp className="size-3" />
                <span>Servicios más frecuentes</span>
              </div>
              <div className="space-y-1">
                {summary.commonServices.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs p-2 bg-neutral-50 rounded"
                  >
                    <span className="text-neutral-950 truncate flex-1">
                      {service.name}
                    </span>
                    <div className="flex items-center gap-3 text-neutral-500">
                      <span>{service.count}x</span>
                      <span className="text-neutral-950">
                        {service.avgPrice.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Quotes */}
          {summary.recentQuotes.length > 0 && (
            <div>
              <p className="text-neutral-500 text-xs mb-2">Presupuestos recientes</p>
              <div className="space-y-1">
                {summary.recentQuotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between text-xs p-2 bg-neutral-50 rounded"
                  >
                    <div className="flex-1 truncate">
                      <span className="text-neutral-950">{quote.contactName}</span>
                      <span className="text-neutral-500 ml-2">
                        {quote.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <span>{quote.items} items</span>
                      <span className="text-neutral-950 font-medium">
                        {quote.total.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={() => setExpanded(false)}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            Colapsar
          </Button>
        </div>
      )}

      {!expanded && summary && (
        <Button
          onClick={() => setExpanded(true)}
          variant="ghost"
          size="sm"
          className="w-full text-xs"
        >
          Mostrar {summary.totalQuotes} presupuestos
        </Button>
      )}
    </div>
  );
}
