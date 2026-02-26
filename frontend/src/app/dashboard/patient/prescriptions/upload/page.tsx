
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import Image from 'next/image';

export default function UploadPrescriptionPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size exceeds 5MB limit.');
        return;
      }
      
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
       if (droppedFile.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit.');
        return;
      }
      setFile(droppedFile);
      setPreviewUrl(URL.createObjectURL(droppedFile));
      setError(null);
    } else {
      setError('Please upload a valid image file (JPG, PNG).');
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a prescription file to upload.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      await apiFetch('/prescriptions/upload', {
        method: 'POST',
        body: formData,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard/patient/prescriptions');
      }, 2000);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Prescription</h1>
        <p className="text-gray-500 mt-2">Upload your doctor's prescription to order medicines.</p>
      </div>

      <Card className="border-dashed border-2 border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Prescription Details</CardTitle>
          <CardDescription>
            Accepted formats: JPG, PNG, PDF (Max 5MB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-12">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900">Upload Successful!</h3>
              <p className="text-gray-500 mt-2">Your prescription has been submitted for verification.</p>
              <p className="text-sm text-gray-400 mt-4">Redirecting to prescriptions list...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {!file ? (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Click or drag file to upload</h3>
                  <p className="text-sm text-gray-500 mt-1">Support for a single or bulk upload.</p>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="relative border rounded-xl overflow-hidden bg-gray-50">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 bg-white/80 hover:bg-red-100 hover:text-red-600 rounded-full z-10"
                    onClick={clearFile}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="p-4 flex flex-col items-center">
                    {previewUrl ? (
                      <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden border bg-white">
                        <img 
                          src={previewUrl} 
                          alt="Prescription Preview" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg mb-4">
                        <FileText className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <p className="font-medium text-gray-900 truncate max-w-full px-4">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start gap-2 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={!file || loading}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent border-white rounded-full"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" /> Upload Prescription
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
