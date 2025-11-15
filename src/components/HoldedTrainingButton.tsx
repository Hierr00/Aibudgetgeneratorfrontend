import { useState } from 'react';
import { getHoldedTrainingData } from '../lib/holded';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { Download } from 'lucide-react';

interface HoldedTrainingButtonProps {
  onDataLoaded?: (data: string) => void;
}

export function HoldedTrainingButton({ onDataLoaded }: HoldedTrainingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadData = async () => {
    setIsLoading(true);

    try {
      toast.info('Obteniendo datos de Holded...', {
        description: 'Cargando histórico de presupuestos',
      });

      const trainingData = await getHoldedTrainingData();

      console.log('📊 Training data loaded:', trainingData.substring(0, 200) + '...');

      toast.success('Datos cargados correctamente', {
        description: 'El agente ahora tiene acceso a datos históricos',
      });

      if (onDataLoaded) {
        onDataLoaded(trainingData);
      }
    } catch (error: any) {
      console.error('Error loading Holded training data:', error);
      
      toast.error('Error al cargar datos', {
        description: error.message || 'No se pudo obtener datos de Holded',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLoadData}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      {isLoading ? 'Cargando...' : 'Cargar datos de Holded'}
    </Button>
  );
}
