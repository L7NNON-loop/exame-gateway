import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormData } from '@/types/form';
import { generateId } from '@/lib/generateId';
import { ref, push } from 'firebase/database';
import { database } from '@/lib/firebase';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';

interface FormStep2Props {
  data: Omit<FormData, 'id' | 'timestamp'>;
  onBack: () => void;
}

export function FormStep2({ data, onBack }: FormStep2Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const generatedId = generateId();

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      const completeData: FormData = {
        ...data,
        id: generatedId,
        timestamp: Date.now(),
      };

      const dbRef = ref(database, 'wanga_exames');
      await push(dbRef, completeData);

      toast.success('Dados confirmados com sucesso!');
      
      // Redirect to WhatsApp group after a short delay
      setTimeout(() => {
        window.location.href = 'https://chat.whatsapp.com/DuF1ZSJZESDHCu4SHSeyga?mode=wwt';
      }, 1500);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast.error('Erro ao processar os dados. Por favor, tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Confirmação de Dados</CardTitle>
        <CardDescription>Verifique seus dados antes de confirmar</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500" />
          <AlertDescription className="text-red-600 dark:text-red-400">
            Por razões de segurança, aconselhamos que não partilhe esse link para evitar exclusão.
          </AlertDescription>
        </Alert>

        <div className="rounded-lg border border-border bg-muted/50 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm font-medium text-muted-foreground">ID:</span>
            <span className="text-sm font-mono font-bold text-primary">{generatedId}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm font-medium text-muted-foreground">Nome completo:</span>
            <span className="text-sm">{data.nomeCompleto}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm font-medium text-muted-foreground">Data de nascimento:</span>
            <span className="text-sm">{data.dataNascimento}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm font-medium text-muted-foreground">Nacionalidade:</span>
            <span className="text-sm">{data.nacionalidade}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm font-medium text-muted-foreground">Sexo:</span>
            <span className="text-sm">{data.sexo}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm font-medium text-muted-foreground">Telefone principal:</span>
            <span className="text-sm">{data.telefonePrincipal}</span>
          </div>
          
          {data.telefoneAlternativo && (
            <div className="grid grid-cols-2 gap-2">
              <span className="text-sm font-medium text-muted-foreground">Telefone alternativo:</span>
              <span className="text-sm">{data.telefoneAlternativo}</span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <span className="text-sm font-medium text-muted-foreground">E-mail:</span>
            <span className="text-[10px] break-all">{data.email}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={onBack} 
            disabled={isSubmitting}
            className="flex-1"
          >
            Voltar
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Confirmar Dados'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
