import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormData } from '@/types/form';
import { toast } from 'sonner';

interface FormStep1Props {
  onNext: (data: Omit<FormData, 'id' | 'timestamp'>) => void;
}

export function FormStep1({ onNext }: FormStep1Props) {
  const [formData, setFormData] = useState<Omit<FormData, 'id' | 'timestamp'>>({
    nomeCompleto: '',
    dataNascimento: '',
    nacionalidade: '',
    sexo: 'Masculino',
    telefonePrincipal: '',
    telefoneAlternativo: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.nomeCompleto.trim()) {
      toast.error('Por favor, preencha o nome completo');
      return;
    }
    if (!formData.dataNascimento) {
      toast.error('Por favor, preencha a data de nascimento');
      return;
    }
    if (!formData.nacionalidade.trim()) {
      toast.error('Por favor, preencha a nacionalidade');
      return;
    }
    if (!formData.telefonePrincipal.trim()) {
      toast.error('Por favor, preencha o telefone principal');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast.error('Por favor, preencha um e-mail válido');
      return;
    }

    onNext(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Formulário de Exames</CardTitle>
        <CardDescription>Preencha seus dados pessoais e de contacto</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">1. Dados Pessoais</h3>
            
            <div className="space-y-2">
              <Label htmlFor="nomeCompleto">Nome completo</Label>
              <Input
                id="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nacionalidade">Nacionalidade</Label>
              <Input
                id="nacionalidade"
                value={formData.nacionalidade}
                onChange={(e) => setFormData({ ...formData, nacionalidade: e.target.value })}
                placeholder="Digite sua nacionalidade"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Sexo</Label>
              <RadioGroup
                value={formData.sexo}
                onValueChange={(value) => setFormData({ ...formData, sexo: value as FormData['sexo'] })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Masculino" id="masculino" />
                  <Label htmlFor="masculino" className="font-normal cursor-pointer">Masculino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Feminino" id="feminino" />
                  <Label htmlFor="feminino" className="font-normal cursor-pointer">Feminino</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Outro" id="outro" />
                  <Label htmlFor="outro" className="font-normal cursor-pointer">Outro</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">2. Contactos</h3>
            
            <div className="space-y-2">
              <Label htmlFor="telefonePrincipal">Telefone principal</Label>
              <Input
                id="telefonePrincipal"
                type="tel"
                value={formData.telefonePrincipal}
                onChange={(e) => setFormData({ ...formData, telefonePrincipal: e.target.value })}
                placeholder="Digite seu telefone principal"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefoneAlternativo">Telefone alternativo</Label>
              <Input
                id="telefoneAlternativo"
                type="tel"
                value={formData.telefoneAlternativo}
                onChange={(e) => setFormData({ ...formData, telefoneAlternativo: e.target.value })}
                placeholder="Digite seu telefone alternativo (opcional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Digite seu e-mail"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Continuar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
