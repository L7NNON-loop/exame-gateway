import { useState } from 'react';
import { FormStep1 } from '@/components/FormStep1';
import { FormStep2 } from '@/components/FormStep2';
import { Footer } from '@/components/Footer';
import { FormData } from '@/types/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const Index = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<Omit<FormData, 'id' | 'timestamp'> | null>(null);

  const handleStep1Complete = (data: Omit<FormData, 'id' | 'timestamp'>) => {
    setFormData(data);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl space-y-4">
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              Por razões de segurança, aconselhamos que não partilhe esse link para evitar exclusão.
            </AlertDescription>
          </Alert>
          
          {step === 1 ? (
            <FormStep1 onNext={handleStep1Complete} />
          ) : (
            formData && <FormStep2 data={formData} onBack={handleBack} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
