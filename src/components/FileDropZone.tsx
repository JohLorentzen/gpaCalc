import React, { useState, useRef } from 'react';
import { Upload, Image, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { GradeResult } from '@/lib/parser';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('calculator');

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
    setProcessingStage(t('ocrProcessing'));
    
    if (onProcessingStart) {
      onProcessingStart();
    }
    
    try {
      // Check file type
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png'].includes(fileExt || '');
      
      if (!isImage) {
        throw new Error('Please upload an image file (JPG, PNG)');
      }
      
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      
      setProcessingStage(t('processing'));
      
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
      
      setProcessingStage(t('analyzingGrades'));
      
      // Check if we got valid results
      if (!data.result || !data.result.entries || data.result.entries.length === 0) {
        throw new Error("No grade data could be extracted from the image. Please check the format and try again.");
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
        title: t('processingComplete'),
        description: `Found ${data.result.entries.length} courses. Average: ${data.result.average.toFixed(2)}/5.`,
      });
      
    } catch (error) {
      console.error("Error processing file:", error);
      setIsProcessing(false);
      setProcessingStage('');
      setError(error instanceof Error ? error.message : "There was a problem analyzing your transcript.");
      
      toast({
        title: t('processingError'),
        description: error instanceof Error ? error.message : "There was a problem analyzing your transcript. Please check the format and try again.",
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
          "file-drop-zone",
          "transform hover:scale-[1.01] hover:shadow-md transition-all",
          isDragging ? "dragging" : "",
          file && !error ? "success" : "",
          error ? "error" : ""
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
            <p className="text-foreground font-medium">{processingStage || t('processing')}</p>
            <p className="text-sm text-muted-foreground max-w-xs text-center">
              {t('processingDescription')}
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium mb-1">{t('processingError')}</p>
              <p className="text-sm text-destructive mb-4">{error}</p>
            </div>
            <Button 
              variant="gradient"
              className="mt-2"
              onClick={handleButtonClick}
            >
              {t('tryAnotherImage')}
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
              variant="gradient"
              className="mt-2"
              onClick={handleButtonClick}
            >
              {t('chooseAnotherFile')}
            </Button>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">{t('uploadTranscript')}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {t('supportedFormats')}
              </p>
            </div>
            <Button
              variant="gradient"
              className="mt-2 text-white"
              onClick={handleButtonClick}
            >
              {t('dropOrClick')}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default FileDropZone;
