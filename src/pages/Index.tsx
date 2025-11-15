import { useState } from 'react';
import { FormStep1 } from '@/components/FormStep1';
import { FormStep2 } from '@/components/FormStep2';
import { Footer } from '@/components/Footer';
import { FormData } from '@/types/form';

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
        {step === 1 ? (
          <FormStep1 onNext={handleStep1Complete} />
        ) : (
          formData && <FormStep2 data={formData} onBack={handleBack} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Index;
