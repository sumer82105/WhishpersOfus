// src/components/MediaUploader.tsx
import React, { ChangeEvent, useState, useRef, DragEvent } from "react";
import axios from "axios";
import { UPLOAD_URL, UPLOAD_PRESET } from "../services/cloudinary";
import { PhotoIcon, XMarkIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

interface MediaUploaderProps {
  onUpload: (url: string) => void;
  currentImageUrl?: string;
  onRemove?: () => void;
  className?: string;
  accept?: string;
  maxSizeMB?: number;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({ 
  onUpload, 
  currentImageUrl,
  onRemove,
  className = "",
  accept = "image/*",
  maxSizeMB = 10
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file';
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    form.append("folder", "memories"); // Organize uploads in folders

    try {
      const response = await axios.post(UPLOAD_URL, form, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      });
      
      onUpload(response.data.secure_url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    await uploadFile(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      await uploadFile(imageFile);
    } else {
      alert('Please drop an image file');
    }
  };

  const handleClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Current Image Preview */}
      {currentImageUrl && !uploading && (
        <div className="relative">
          <img
            src={currentImageUrl}
            alt="Memory preview"
            className="w-full h-48 object-cover rounded-lg border border-pink-200"
          />
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          dragOver
            ? 'border-pink-400 bg-pink-50'
            : uploading
            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-pink-300 hover:border-pink-400 hover:bg-pink-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept={accept}
          disabled={uploading}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-3">
            <CloudArrowUpIcon className="w-12 h-12 text-pink-400 mx-auto animate-bounce" />
            <div>
              <p className="text-sm text-gray-600 mb-2">Uploading...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <PhotoIcon className="w-12 h-12 text-pink-400 mx-auto" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {currentImageUrl ? 'Change Photo' : 'Upload a Photo'}
              </p>
              <p className="text-xs text-gray-500">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max {maxSizeMB}MB • JPG, PNG, GIF
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
