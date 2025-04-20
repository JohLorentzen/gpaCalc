import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Check, Upload, X, FileImage } from 'lucide-react';
import { GradeResult } from '@/utils/parser';

interface TranscriptUploaderProps {
  onUploadComplete?: (result: GradeResult) => void;
}

const TranscriptUploader: React.FC<TranscriptUploaderProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Reset states
      setError(null);
      setSuccess(false);
      setProgress(0);
      
      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please upload an image file (PNG, JPG, etc.)');
        return;
      }
      
      // Set the selected file
      setFile(selectedFile);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      // Reset states
      setError(null);
      setSuccess(false);
      setProgress(0);
      
      // Validate file type
      if (!droppedFile.type.startsWith('image/')) {
        setError('Please upload an image file (PNG, JPG, etc.)');
        return;
      }
      
      // Set the dropped file
      setFile(droppedFile);
    }
  };
  
  const uploadFile = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }
    
    setUploading(true);
    setProgress(10);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      setProgress(30);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      setProgress(70);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }
      
      const result = await response.json();
      setProgress(100);
      setSuccess(true);
      
      // Call the upload complete callback with the result
      if (onUploadComplete && result.data) {
        onUploadComplete(result.data);
      }
      
    } catch (err) {
      setError((err as Error).message || 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };
  
  const resetUploader = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Upload Transcript</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            error ? 'border-red-300 bg-red-50' : 
            success ? 'border-green-300 bg-green-50' : 
            'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!file && !success ? (
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <FileImage className="h-6 w-6 text-gray-600" />
              </div>
              
              <div>
                <p className="text-gray-600 mb-2">Drag and drop your transcript image here</p>
                <p className="text-gray-500 text-sm mb-4">or</p>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  className="mx-auto"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Select File
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {success ? (
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <FileImage className="h-8 w-8 text-gray-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700 truncate max-w-[240px]">
                      {file?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file?.size ? (file.size / 1024).toFixed(1) : '0')} KB
                    </p>
                  </div>
                </div>
              )}
              
              {uploading && (
                <Progress value={progress} className="h-2" />
              )}
              
              {success && (
                <p className="text-green-600 text-sm">
                  Transcript processed successfully!
                </p>
              )}
              
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={resetUploader}
          disabled={uploading}
        >
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
        
        <Button
          onClick={uploadFile}
          disabled={!file || uploading || success}
        >
          {uploading ? 'Processing...' : 'Process Transcript'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TranscriptUploader; 