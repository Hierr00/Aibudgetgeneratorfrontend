import { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function HoldedDebug() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d5269fc7/holded/test`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success('Conexión exitosa con Holded', {
          description: `${data.contactCount} contactos encontrados`,
        });
      } else {
        toast.error('Error en la conexión', {
          description: data.error || 'Verifica la API key',
        });
      }
    } catch (error: any) {
      const errorData = { success: false, error: error.message };
      setResult(errorData);
      toast.error('Error de conexión', {
        description: error.message,
      });
    } finally {
      setTesting(false);
    }
  };

  const getAccounts = async () => {
    setLoadingAccounts(true);
    setResult(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d5269fc7/holded/accounts`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success('Cuentas contables obtenidas', {
          description: `${data.serviceAccounts?.length || 0} cuentas de servicios encontradas`,
        });
        
        // Log the service accounts to console for debugging
        console.log('🏦 Cuentas de servicios:', data.serviceAccounts);
      } else {
        toast.error('Error al obtener cuentas', {
          description: data.error || 'Verifica la API key',
        });
      }
    } catch (error: any) {
      const errorData = { success: false, error: error.message };
      setResult(errorData);
      toast.error('Error al obtener cuentas', {
        description: error.message,
      });
    } finally {
      setLoadingAccounts(false);
    }
  };

  const getProducts = async () => {
    setLoadingProducts(true);
    setResult(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-d5269fc7/holded/products`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success('Productos obtenidos de Holded', {
          description: `${data.count} productos encontrados`,
        });
        
        // Log the products to console for debugging
        console.log('📦 Productos de Holded:', data.products);
      } else {
        toast.error('Error al obtener productos', {
          description: data.error || 'Verifica la API key',
        });
      }
    } catch (error: any) {
      const errorData = { success: false, error: error.message };
      setResult(errorData);
      toast.error('Error al obtener productos', {
        description: error.message,
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <div className="p-4 border border-neutral-200 rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Holded API Debug</h3>
        <div className="flex gap-2">
          <Button
            onClick={testConnection}
            disabled={testing}
            size="sm"
            variant="outline"
          >
            {testing ? 'Probando...' : 'Probar Conexión'}
          </Button>
          <Button
            onClick={getAccounts}
            disabled={loadingAccounts}
            size="sm"
            variant="outline"
          >
            {loadingAccounts ? 'Cargando...' : 'Ver Cuentas'}
          </Button>
          <Button
            onClick={getProducts}
            disabled={loadingProducts}
            size="sm"
            variant="outline"
          >
            {loadingProducts ? 'Cargando...' : 'Ver Productos'}
          </Button>
        </div>
      </div>

      {result && (
        <div className="mt-3 p-3 bg-neutral-50 rounded text-xs font-mono overflow-x-auto max-h-96 overflow-y-auto">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}