import React, { useState, useRef } from 'react';
import { uploadToCloudinary, CloudinaryFolder } from '../cloudinary/uploadService';
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface CloudinaryUploaderProps {
  folder: CloudinaryFolder;
  onUploadSuccess: (url: string) => void;
  label?: string;
}

export default function CloudinaryUploader({ folder, onUploadSuccess, label = "Upload Image" }: CloudinaryUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setupFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setupFile(e.target.files[0]);
    }
  };

  const setupFile = (selectedFile: File) => {
    setError(null);
    setSuccess(false);
    setProgress(0);
    
    if (!selectedFile.type.startsWith('image/')) {
      setError('Only image files are supported (.jpg, .png, .webp, .svg)');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('Image is too large. Peak allowed limit is 10MB.');
      return;
    }

    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const triggerUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadToCloudinary(file, folder, (p) => {
        setProgress(p);
      });
      setSuccess(true);
      onUploadSuccess(url);
    } catch (err: any) {
      setError(err?.message || 'Upload transmission failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetUploader = () => {
    setFile(null);
    setPreviewUrl(null);
    setProgress(0);
    setUploading(false);
    setError(null);
    setSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full space-y-3">
      {label && <span className="text-xs font-mono text-slate-400 capitalize">{label}</span>}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all flex flex-col items-center justify-center ${
          dragActive 
            ? 'border-blue-500 bg-blue-500/5' 
            : previewUrl 
            ? 'border-slate-800 bg-slate-950/20' 
            : 'border-slate-800 hover:border-slate-705 bg-slate-950/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {previewUrl ? (
          // Preview and control menu
          <div className="space-y-4 w-full flex flex-col items-center">
            <div className="relative h-28 w-28 rounded-lg overflow-hidden border border-slate-850">
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              {!uploading && (
                <button
                  type="button"
                  onClick={resetUploader}
                  className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-black rounded-full text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {uploading ? (
              // Progress tracking
              <div className="w-full max-w-xs space-y-1.5 font-mono">
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Uploading Packet...</span>
                  <span className="text-blue-400 font-bold">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : success ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/40 border border-emerald-500/20 text-xs font-mono text-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Uploaded Successfully</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={triggerUpload}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold cursor-pointer"
                >
                  Confirm Upload
                </button>
                <button
                  type="button"
                  onClick={resetUploader}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-mono cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          // Dropzone display
          <div className="space-y-2 pointer-events-none">
            <div className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
              <Upload className="w-4.5 h-4.5" />
            </div>
            <div className="text-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-400 hover:text-blue-300 underline font-mono cursor-pointer pointer-events-auto"
              >
                Choose image
              </button>
              <span className="text-slate-500"> or drag file here</span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Accepted image schemas, size limit 10MB
            </p>
          </div>
        )}

        {error && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-rose-950/40 border border-rose-500/20 text-[10px] font-mono text-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-450" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
