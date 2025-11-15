import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { FormData } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LogOut, FileText, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface AdminPanelProps {
  onLogout: () => void;
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [submissions, setSubmissions] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const dbRef = ref(database, 'wanga_exames');
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const submissionsArray: FormData[] = Object.values(data);
        // Sort by timestamp, most recent first
        submissionsArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        setSubmissions(submissionsArray);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleViewDetails = (submission: FormData) => {
    setSelectedSubmission(submission);
    setDialogOpen(true);
  };

  const handleDownloadPDF = (submission: FormData) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Dados do Formulário de Exames', 20, 20);
    
    doc.setFontSize(12);
    let y = 40;
    
    doc.text(`ID: ${submission.id}`, 20, y);
    y += 10;
    doc.text(`Nome completo: ${submission.nomeCompleto}`, 20, y);
    y += 10;
    doc.text(`Data de nascimento: ${submission.dataNascimento}`, 20, y);
    y += 10;
    doc.text(`Nacionalidade: ${submission.nacionalidade}`, 20, y);
    y += 10;
    doc.text(`Sexo: ${submission.sexo}`, 20, y);
    y += 10;
    doc.text(`Telefone principal: ${submission.telefonePrincipal}`, 20, y);
    y += 10;
    if (submission.telefoneAlternativo) {
      doc.text(`Telefone alternativo: ${submission.telefoneAlternativo}`, 20, y);
      y += 10;
    }
    doc.text(`E-mail: ${submission.email}`, 20, y);
    y += 10;
    if (submission.timestamp) {
      doc.text(`Data de submissão: ${new Date(submission.timestamp).toLocaleString('pt-BR')}`, 20, y);
    }
    
    doc.save(`formulario_${submission.id}.pdf`);
    toast.success('PDF baixado com sucesso');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    onLogout();
    toast.success('Sessão encerrada');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Painel Administrativo</CardTitle>
                <CardDescription>Visualize todos os formulários submetidos</CardDescription>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhum formulário submetido ainda
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">ID</TableHead>
                      <TableHead className="min-w-[180px]">Nome</TableHead>
                      <TableHead className="min-w-[180px]">E-mail</TableHead>
                      <TableHead className="w-[130px]">Telefone</TableHead>
                      <TableHead className="w-[100px]">Data</TableHead>
                      <TableHead className="w-[180px] text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-xs">{submission.id}</TableCell>
                        <TableCell className="font-medium">{submission.nomeCompleto}</TableCell>
                        <TableCell className="text-sm break-all max-w-[200px]">{submission.email}</TableCell>
                        <TableCell className="text-sm">{submission.telefonePrincipal}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {submission.timestamp 
                            ? new Date(submission.timestamp).toLocaleDateString('pt-BR')
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(submission)}
                            >
                              Ver Detalhes
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadPDF(submission)}
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes Completos</DialogTitle>
            <DialogDescription>Informações completas do formulário</DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-lg bg-muted/50">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">ID:</span>
                  <p className="font-mono font-bold text-primary">{selectedSubmission.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nome completo:</span>
                  <p>{selectedSubmission.nomeCompleto}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Data de nascimento:</span>
                  <p>{selectedSubmission.dataNascimento}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Nacionalidade:</span>
                  <p>{selectedSubmission.nacionalidade}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Sexo:</span>
                  <p>{selectedSubmission.sexo}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Telefone principal:</span>
                  <p>{selectedSubmission.telefonePrincipal}</p>
                </div>
                {selectedSubmission.telefoneAlternativo && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Telefone alternativo:</span>
                    <p>{selectedSubmission.telefoneAlternativo}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-muted-foreground">E-mail:</span>
                  <p>{selectedSubmission.email}</p>
                </div>
                {selectedSubmission.timestamp && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-muted-foreground">Data de submissão:</span>
                    <p>{new Date(selectedSubmission.timestamp).toLocaleString('pt-BR')}</p>
                  </div>
                )}
              </div>
              <Button 
                onClick={() => handleDownloadPDF(selectedSubmission)}
                className="w-full"
              >
                <FileText className="mr-2 h-4 w-4" />
                Baixar PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
