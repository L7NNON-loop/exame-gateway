import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const ADMIN_CODE = 'WANGA_NHINE';

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code === ADMIN_CODE) {
      sessionStorage.setItem('admin_authenticated', 'true');
      onLogin();
      toast.success('Acesso autorizado');
    } else {
      toast.error('Código de autorização inválido');
      setCode('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Painel Administrativo</CardTitle>
          <CardDescription>Digite o código de autorização para acessar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código de Autorização</Label>
              <Input
                id="code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Digite o código"
                required
                autoComplete="off"
              />
            </div>
            <Button type="submit" className="w-full">
              Acessar Painel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
