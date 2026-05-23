export type CloudinaryFolder = 
  | 'portfolio/profile' 
  | 'portfolio/awards' 
  | 'portfolio/projects' 
  | 'portfolio/achievements';

export interface UploadProgressCallback {
  (progress: number): void;
}

/**
 * Uploads a file to Cloudinary unsigned endpoint.
 * Includes folder organization and real-time progress updates.
 */
export const uploadToCloudinary = (
  file: File,
  folder: CloudinaryFolder,
  onProgress: UploadProgressCallback
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file type (must be image) and size (under 10MB to prevent attacks)
    if (!file.type.startsWith('image/')) {
      reject(new Error('This file format is not supported. Please upload an image.'));
      return;
    }
    
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSizeBytes) {
      reject(new Error('The image exceeds the limit of 10MB. Please use a smaller file.'));
      return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    
    formData.append('file', file);
    formData.append('upload_preset', 'portfolio_uploads');
    formData.append('folder', folder);
    
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/dy8dq4ujw/image/upload', true);
    
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentage = Math.round((e.loaded * 100) / e.total);
        onProgress(percentage);
      }
    };
    
    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 201) {
        try {
          const response = JSON.parse(xhr.responseText);
          if (response.secure_url) {
            resolve(response.secure_url);
          } else {
            reject(new Error('Cloudinary response did not contain secure_url'));
          }
        } catch (e) {
          reject(new Error('Failed to parse Cloudinary response object'));
        }
      } else {
        try {
          const ferr = JSON.parse(xhr.responseText);
          reject(new Error(ferr.error?.message || 'Cloudinary server error during upload'));
        } catch (_) {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
        }
      }
    };
    
    xhr.onerror = () => {
      reject(new Error('Network communication failure during file upload'));
    };
    
    xhr.send(formData);
  });
};
