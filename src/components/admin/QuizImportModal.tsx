import React, { useState } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { QuizImport } from '../../types';
import { parseTxtQuiz } from '../../lib/quizParser';

interface QuizImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (quiz: QuizImport) => Promise<void>;
}

export function QuizImportModal({ isOpen, onClose, onImport }: QuizImportModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [timeLimit, setTimeLimit] = useState('30');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      
      // Se for JSON, tenta extrair os metadados
      if (file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const content = e.target?.result as string;
            const data = JSON.parse(content);
            if (data.title) setTitle(data.title);
            if (data.subject) setSubject(data.subject);
            if (data.timeLimit) setTimeLimit(data.timeLimit.toString());
          } catch (err) {
            // Ignora erros na pré-visualização
          }
        };
        reader.readAsText(file);
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const content = await selectedFile.text();
      let quiz: QuizImport;

      if (selectedFile.name.endsWith('.json')) {
        quiz = JSON.parse(content);
        
        if (!quiz.title || !quiz.subject || !quiz.questions?.length) {
          throw new Error('Formato de arquivo JSON inválido');
        }
      } else if (selectedFile.name.endsWith('.txt')) {
        if (!title || !subject || !timeLimit) {
          throw new Error('Preencha todos os campos antes de importar o arquivo TXT');
        }

        const questions = parseTxtQuiz(content);
        quiz = {
          title,
          subject,
          timeLimit: parseInt(timeLimit, 10),
          questions: questions.map(q => ({
            ...q,
            subject,
          })),
        };
      } else {
        throw new Error('Formato de arquivo não suportado. Use .json ou .txt');
      }

      await onImport(quiz);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao importar arquivo');
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = selectedFile && (
    selectedFile.name.endsWith('.json') || 
    (title && subject && timeLimit && parseInt(timeLimit, 10) > 0)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Importar Quiz">
      <div className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Título do Quiz"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Matemática Básica"
          />
          <Input
            label="Matéria"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ex: Matemática"
          />
          <Input
            label="Tempo Limite (minutos)"
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            min="1"
            max="180"
          />
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  {selectedFile ? selectedFile.name : 'Selecione um arquivo JSON ou TXT'}
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".json,.txt"
                  className="sr-only"
                  onChange={handleFileSelect}
                  disabled={isLoading}
                />
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">Arquivos até 10MB</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro na importação</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-md p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Formatos suportados:</h4>
          
          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700">Formato TXT:</h5>
              <pre className="mt-1 text-xs text-gray-600 overflow-auto whitespace-pre-wrap">
{`P: Texto da questão
a: Primeira opção
b: Segunda opção
c: Terceira opção*
d: Quarta opção

P: Próxima questão
a: Opção 1
b: Opção 2*
c: Opção 3
d: Opção 4`}
              </pre>
              <p className="mt-1 text-xs text-gray-500">
                * Marque a opção correta com um asterisco (*) no final
              </p>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-700">Formato JSON:</h5>
              <pre className="mt-1 text-xs text-gray-600 overflow-auto">
{`{
  "title": "Título do Quiz",
  "subject": "Matéria",
  "timeLimit": 30,
  "questions": [
    {
      "text": "Texto da questão",
      "options": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
      "correctOption": 0,
      "subject": "Matéria",
      "difficulty": "medium"
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            isLoading={isLoading}
            disabled={!isValid}
          >
            Importar
          </Button>
        </div>
      </div>
    </Modal>
  );
}