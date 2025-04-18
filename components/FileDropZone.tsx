import React, { useState, useRef } from 'react';
import { Upload, Image, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { GradeResult } from '@/lib/parser';

interface FileDropZoneProps {
  onFileProcessed: (average: number, details?: GradeResult) => void;
  onProcessingStart?: () => void;
}

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileProcessed, onProcessingStart }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStage, setProcessingStage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setProcessingStage('Starter OCR-behandling...');
    
    if (onProcessingStart) {
      onProcessingStart();
    }
    
    try {
      // Check file type
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png'].includes(fileExt || '');
      
      if (!isImage) {
        throw new Error('Vennligst last opp en bildefil (JPG, PNG)');
      }
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      setProcessingStage('Laster opp karakterutskriftsbilde...');
      
      // Call the OCR API
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.details || `Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setProcessingStage('Processing transcript data...');
      
      // Check if we got valid results
      if (!data.result || !data.result.entries || data.result.entries.length === 0) {
        throw new Error("Ingen karakterdata kunne ekstraheres fra bildet. Vennligst sjekk formatet og prøv igjen.");
      }
      
      console.log("Raw API response:", JSON.stringify(data, null, 2));
      
      // Log details of each entry
      data.result.entries.forEach((entry, index) => {
        console.log(`Entry ${index}:`, entry);
        console.log(`Credits type: ${typeof entry.credits}, value: ${entry.credits}`);
      });
      
      setIsProcessing(false);
      setProcessingStage('');
      
      // Call the callback with the results
      onFileProcessed(data.result.average, data.result);
      
      toast({
        title: "Karakterutskrift behandlet",
        description: `Fant ${data.result.entries.length} emner. Gjennomsnitt: ${data.result.average.toFixed(2)}/5.`,
      });
      
    } catch (error) {
      console.error("Error processing file:", error);
      setIsProcessing(false);
      setProcessingStage('');
      setError(error instanceof Error ? error.message : "Det oppstod et problem med analysen av karakterutskriftet ditt.");
      
      toast({
        title: "Feil ved behandling av karakterutskrift",
        description: error instanceof Error ? error.message : "Det oppstod et problem med analysen av karakterutskriftet ditt. Vennligst sjekk formatet og prøv igjen.",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      processFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-4 transition-all",
          "transform hover:scale-[1.01] hover:shadow-md",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-secondary/50 hover:bg-secondary/5 hover:border-gradient-to-r hover:from-primary/50 hover:to-secondary/50",
          file && !error ? "bg-confirmation/5 border-confirmation/50" : "",
          error ? "bg-destructive/5 border-destructive/50" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/jpeg,image/png"
        />
        
        {isProcessing ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-foreground font-medium">{processingStage || 'Analyserer karakterutskriftet ditt...'}</p>
            <p className="text-sm text-muted-foreground max-w-xs text-center">
              Dette kan ta litt tid mens vi henter ut teksten fra bildet ditt.
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium mb-1">Feil ved behandling av karakterutskrift</p>
              <p className="text-sm text-destructive mb-4">{error}</p>
            </div>
            <Button 
              variant="primary"
              className="mt-2 gradient-btn"
              onClick={handleButtonClick}
            >
              Prøv et annet bilde
            </Button>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-confirmation/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-confirmation" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium mb-1">{file.name}</p>
              <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
            <Button 
              variant="primary"
              className="mt-2 gradient-btn"
              onClick={handleButtonClick}
            >
              Last opp et annet bilde
            </Button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image className="w-8 h-8 text-secondary" aria-hidden="true" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-1">Slipp ditt Universitets/Høyskole karakterutskrift her</h3>
              <p className="text-muted-foreground mb-4">eller klikk for å bla</p>
            </div>
            <Button 
              variant="primary"
              className="flex items-center gap-2 gradient-btn hover:shadow-lg transition-all"
              onClick={handleButtonClick}
            >
              <Upload className="w-4 h-4" />
              Bla gjennom filer
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Støtter Universitets/Høyskole karakterutskriftsbilder eller skjermbilder (JPG, PNG, JPEG)
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Støtter både norske og engelske karakterutskrifter med bestått/passed emner
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileDropZone;
