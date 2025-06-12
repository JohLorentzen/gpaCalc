"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Upload, CheckCircle, AlertTriangle, LogIn, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { GradeResult, GradeEntry } from '@/lib/parser';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { getUploadStatus, recordUpload } from '@/lib/user-profile-actions';
import { useTranslations } from 'next-intl';
import AuthModal from './AuthModal';

// Define a type for the status returned by getUploadStatus if direct import is an issue
type FetchedUploadStatus = Awaited<ReturnType<typeof getUploadStatus>>;

interface FileDropZoneProps {
  onFileProcessed: (average: number, details?: GradeResult) => void;
  onProcessingStart?: () => void;
  locale: string;
}

interface ClientUploadStatus {
    remaining: number;
    limitReached: boolean;
    cycleStartDate: Date | null;
    message?: string;
}

const MAX_UPLOADS_PER_CYCLE = 6;

const FileDropZone: React.FC<FileDropZoneProps> = ({ onFileProcessed, onProcessingStart, locale }) => {
  const t = useTranslations('calculator');
  const tErrors = useTranslations('errors');
  const tAuth = useTranslations('auth');
  
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingStage, setProcessingStage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [uploadLimitStatus, setUploadLimitStatus] = useState<ClientUploadStatus | null>(null);
  const [isLoadingLimitStatus, setIsLoadingLimitStatus] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    setLoadingUser(true);
    const fetchInitialUser = async () => {
      const { data: { user: fetchedUser } } = await supabase.auth.getUser();
      setUser(fetchedUser);
      setLoadingUser(false);
    };
    fetchInitialUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoadingUser(false);
      if (event === "SIGNED_OUT") {
          setFile(null);
          setError(null);
          setIsProcessing(false);
          setProcessingStage('');
          setUploadLimitStatus(null);
      }
    });
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      setIsLoadingLimitStatus(true);
      getUploadStatus().then((status: FetchedUploadStatus) => {
        if (status.error) {
            console.error("Error fetching upload status:", status.error);
            toast({ title: t('uploadLimitError'), description: status.error, variant: "destructive"});
            setUploadLimitStatus({ remaining: 0, limitReached: true, cycleStartDate: null, message: t('uploadLimitLoadError') });
        } else {
            const cycleDate = status.cycleStartDate ? new Date(status.cycleStartDate) : null;
            setUploadLimitStatus({ 
                remaining: status.remaining,
                limitReached: status.limitReached,
                cycleStartDate: cycleDate,
            });
        }
        setIsLoadingLimitStatus(false);
      }).catch(err => {
        console.error("Client error fetching upload status:", err);
        toast({ title: tErrors('title'), description: t('fetchLimitError'), variant: "destructive"});
        setUploadLimitStatus({ remaining: 0, limitReached: true, cycleStartDate: null, message: t('uploadLimitLoadError') });
        setIsLoadingLimitStatus(false);
      });
    } else {
      setUploadLimitStatus(null);
    }
  }, [user, toast, t, tErrors]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (uploadLimitStatus?.limitReached) return; 
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (uploadLimitStatus?.limitReached) return;
    setIsDragging(false);
  };

  const processFile = async (fileToProcess: File) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (uploadLimitStatus?.limitReached) {
      toast({ title: t('uploadLimitReached'), description: t('noUploadsRemaining'), variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setError(null);
    setProcessingStage(t('ocrProcessing'));
    if (onProcessingStart) onProcessingStart();
    
    try {
      const fileExt = fileToProcess.name.split('.').pop()?.toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png'].includes(fileExt || '');
      if (!isImage) throw new Error(t('imageFormatError'));
      const formData = new FormData();
      formData.append('file', fileToProcess);
      setProcessingStage(t('processing'));
      const response = await fetch('/api/ocr', { method: 'POST', body: formData });
      if (!response.ok) {
        let errData;
        try {
          errData = await response.json();
        } catch (jsonError) {
          // If response isn't valid JSON, use the response text
          const errorText = await response.text();
          throw new Error(`Server error (${response.status}): ${errorText || response.statusText}`);
        }
        throw new Error(errData.error || errData.details || `${tErrors('title')}: ${response.status} ${response.statusText}`);
      }
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If response isn't valid JSON, use the response text
        const responseText = await response.text();
        throw new Error(`Invalid server response: ${responseText}`);
      }
      
      if (data.error) throw new Error(data.error);
      setProcessingStage(t('analyzingGrades'));
      if (!data.result || !data.result.entries || data.result.entries.length === 0) {
        throw new Error(t('noGradeData'));
      }
      
      // Only record the upload AFTER we have successfully analyzed the transcript
      // and found valid data - this prevents charging a credit for failed analyses
      const recordResult = await recordUpload();
      if (recordResult.success) {
        onFileProcessed(data.result.average, data.result);
        toast({ title: t('processingComplete'), description: t('foundCoursesAverage', { count: data.result.entries.length, average: data.result.average.toFixed(2) }) });
        if (recordResult.newRemaining !== undefined && recordResult.newCycleStartDate) {
            setUploadLimitStatus({
                remaining: recordResult.newRemaining,
                limitReached: recordResult.newRemaining <= 0,
                cycleStartDate: new Date(recordResult.newCycleStartDate),
            });
        }
      } else {
        console.error("Failed to record upload:", recordResult.error);
        throw new Error(recordResult.error || t('failedToSaveUpload'));
      }

    } catch (err) {
      console.error("Error processing file:", err);
      const errorMessage = err instanceof Error ? err.message : t('transcriptAnalyzingProblem');
      setError(errorMessage);
      toast({ title: t('processingError'), description: `${errorMessage}`, variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (uploadLimitStatus?.limitReached) {
        toast({ title: t('uploadLimitReached'), description: t('noUploadsRemaining'), variant: "destructive" });
        return;
    }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      processFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
     if (uploadLimitStatus?.limitReached) {
        toast({ title: t('uploadLimitReached'), description: t('noUploadsRemaining'), variant: "destructive" });
        return;
    }
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const handleButtonClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (uploadLimitStatus?.limitReached) {
        toast({ title: t('uploadLimitReached'), description: t('noUploadsRemaining'), variant: "destructive" });
        return;
    }
    fileInputRef.current?.click();
  };

  const getCycleEndDateFormatted = () => {
    if (uploadLimitStatus?.cycleStartDate) {
        const endDate = new Date(uploadLimitStatus.cycleStartDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        endDate.setDate(endDate.getDate() -1);
        return endDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return t('notAvailable');
  };

  const renderContent = () => {
    if (loadingUser || (user && isLoadingLimitStatus)) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">{loadingUser ? t('checkingAuth') : t('fetchingUploadLimit')}</p>
        </div>
      );
    }

    if (uploadLimitStatus?.limitReached) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Info className="w-12 h-12 text-destructive mb-4" />
                <h3 className="text-lg font-semibold text-destructive mb-2">{t('uploadLimitReached')}</h3>
                <p className="text-sm text-muted-foreground px-4">
                    {t('usedAllUploads', { count: MAX_UPLOADS_PER_CYCLE })}
                    {t('nextUploadAvailable')} {getCycleEndDateFormatted()}.
                </p>
            </div>
        );
    }

    if (isProcessing) {
        return (
            <div className="flex flex-col items-center gap-4 relative overflow-hidden p-4">
                <div className="absolute inset-0 animate-shimmer opacity-25"></div>
                <div className="relative z-10">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-secondary/70 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 bg-primary/60 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <div className="relative z-10 text-center">
                    <p className="text-foreground font-medium">{processingStage || t('processing')}</p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        {t('documentBeingProcessed')}
                    </p>
                    <div className="flex space-x-2 mt-1 justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex flex-col items-center gap-4 p-4">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-destructive" />
                </div>
                <div className="text-center">
                    <p className="text-foreground font-medium mb-1">{t('processingError')}</p>
                    <p className="text-sm text-destructive mb-4">{error}</p>
                </div>
                <Button variant="gradient" className="mt-2" onClick={handleButtonClick}>
                    {t('tryAnotherImage')}
                </Button>
            </div>
        );
    }
    if (file) {
        return (
            <div className="flex flex-col items-center gap-4 p-4">
                <div className="w-16 h-16 rounded-full bg-confirmation/10 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-confirmation" />
                </div>
                <div className="text-center">
                    <p className="text-foreground font-medium mb-1">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
                <Button variant="gradient" className="mt-2" onClick={handleButtonClick}>
                    {t('chooseAnotherFile')}
                </Button>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">{t('uploadTranscript')}</h3>
            <p className="text-sm text-muted-foreground mb-6">
                {t('supportedFormats')}
            </p>
            <Button variant="gradient" className="mt-2 text-white" onClick={handleButtonClick}>
                {t('dropOrClick')}
            </Button>
        </div>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={cn(
          "file-drop-zone",
          "transform hover:scale-[1.01] transition-all",
          !uploadLimitStatus?.limitReached && isDragging ? "dragging" : "",
          {
            'opacity-50 cursor-not-allowed': uploadLimitStatus?.limitReached
          }
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
          disabled={Boolean(uploadLimitStatus?.limitReached || isLoadingLimitStatus || isProcessing)}
        />
        {renderContent()}
      </div>
      {user && uploadLimitStatus && !isLoadingLimitStatus && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
            {uploadLimitStatus.limitReached ? (
                <p>
                    {t('uploadLimitReached')} {t('nextUploadAvailable')} {getCycleEndDateFormatted()}.
                </p>
            ) : (
                <p>
                    {t('uploadsRemaining', { 
                        remaining: uploadLimitStatus.remaining, 
                        total: MAX_UPLOADS_PER_CYCLE 
                    })}
                    {uploadLimitStatus.cycleStartDate ? 
                        t('cycleEndDate', { date: getCycleEndDateFormatted() }) : 
                        t('firstUploadCycle')
                    }
                </p>
            )}
        </div>
      )}
      {user && isLoadingLimitStatus && (
           <div className="mt-4 text-center text-sm text-muted-foreground">
               {t('loadingUploadLimit')}
           </div>
      )}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        locale={locale} 
      />
    </div>
  );
};

export default FileDropZone;
