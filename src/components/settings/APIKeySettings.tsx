import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Alert, AlertDescription } from "../ui/alert";
import { Key, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

interface APIKeySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onSave: (key: string) => void;
}

export function APIKeySettings({ isOpen, onClose, currentKey, onSave }: APIKeySettingsProps) {
  const [apiKey, setApiKey] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey);
      onClose();
    }
  };

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (response.ok) {
        setTestResult('success');
      } else {
        setTestResult('error');
      }
    } catch (error) {
      setTestResult('error');
    } finally {
      setTesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Configurar API Key
          </DialogTitle>
          <DialogDescription>
            Ingresa tu API Key de OpenAI para habilitar el asistente de IA.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">OpenAI API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Tu API Key se almacena localmente y nunca se comparte.
            </p>
          </div>

          {testResult === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Conexión exitosa. API Key válida.
              </AlertDescription>
            </Alert>
          )}

          {testResult === 'error' && (
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                API Key inválida o sin acceso.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={testConnection}
              disabled={!apiKey || testing}
              className="flex-1"
            >
              {testing ? "Probando..." : "Probar"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!apiKey}
              className="flex-1"
            >
              Guardar
            </Button>
          </div>

          <div className="text-xs text-neutral-500 space-y-1">
            <p>¿No tienes una API Key?</p>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Obtén una en platform.openai.com →
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
