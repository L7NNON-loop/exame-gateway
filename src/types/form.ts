export interface FormData {
  id?: string;
  nomeCompleto: string;
  dataNascimento: string;
  nacionalidade: string;
  sexo: 'Masculino' | 'Feminino' | 'Outro';
  telefonePrincipal: string;
  telefoneAlternativo: string;
  email: string;
  timestamp?: number;
}
