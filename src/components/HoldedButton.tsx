import { useState } from 'react';
import HoldedButtonUI from '../imports/Button';
import { createHoldedQuote } from '../lib/holded';
import type { BudgetData } from '../lib/ai';
import { toast } from 'sonner@2.0.3';

interface HoldedButtonProps {
  budgetData: BudgetData;
  disabled?: boolean;
}

export function HoldedButton({ budgetData, disabled }: HoldedButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToHolded = async () => {
    // Validate budget data
    if (!budgetData.items || budgetData.items.length === 0) {
      toast.error('No hay items en el presupuesto', {
        description: 'Agrega al menos un item antes de enviar a Holded',
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('📋 Budget data being sent:', JSON.stringify(budgetData, null, 2));
      
      toast.info('Enviando a Holded...', {
        description: 'Creando presupuesto en Holded',
      });

      const result = await createHoldedQuote(budgetData, {
        name: budgetData.clientName,
        email: budgetData.clientEmail,
      });

      if (result.success) {
        toast.success('¡Presupuesto creado en Holded!', {
          description: result.message || 'El presupuesto se ha sincronizado correctamente',
        });
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (error: any) {
      console.error('❌ Error completo al crear presupuesto:', error);
      console.error('❌ Budget data que causó el error:', budgetData);
      
      let errorMessage = 'No se pudo crear el presupuesto en Holded';
      let errorDescription = error.message;

      if (error.message?.includes('API key')) {
        errorMessage = 'API Key de Holded no configurada';
        errorDescription = 'Contacta con soporte para configurar la integración';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Error de conexión';
        errorDescription = 'Verifica tu conexión a internet';
      }

      toast.error(errorMessage, {
        description: errorDescription,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToHolded}
      disabled={disabled || isLoading}
      className={`relative ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} transition-all duration-200`}
      style={{ width: '140px', height: '28px' }}
    >
      {isLoading ? (
        <div className="bg-white relative rounded-[8px] size-full flex items-center justify-center">
          <div className="size-4 border-2 border-neutral-300 border-t-neutral-950 rounded-full animate-spin" />
        </div>
      ) : (
        <HoldedButtonUI />
      )}
    </button>
  );
}