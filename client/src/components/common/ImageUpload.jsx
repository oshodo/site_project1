// ============================================================
// client/src/components/common/ImageUpload.jsx
// Upload images directly to server → Cloudinary pipeline
// ============================================================
import { useState, useRef } from 'react';
import { uploadAPI } from '../../utils/api';

const ImageUpload = ({ onUpload, multiple = false, existingImages = [] }) => {
  const [previews, setPreviews]   = useState(existingImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState('');
  const inputRef                  = useRef();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setError('');
    setUploading(true);

    try {
      if (multiple) {
        const formData = new FormData();
        files.forEach((f) => formData.append('images', f));
        const res = await uploadAPI.uploadMultiple(formData);
        const uploaded = res.data.data; // [{ url, publicId }]
        setPreviews((prev) => [...prev, ...uploaded]);
        onUpload([...previews, ...uploaded]);
      } else {
        const formData = new FormData();
        formData.append('image', files[0]);
        const res = await uploadAPI.uploadOne(formData);
        const uploaded = res.data.data; // { url, publicId }
        setPreviews([uploaded]);
        onUpload([uploaded]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Check file size (max 5MB).');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index) => {
    const img = previews[index];
    try {
      await uploadAPI.deleteImage(img.publicId);
    } catch {
      // If deletion fails on Cloudinary side, still remove from UI
    }
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    onUpload(updated);
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onClick={() => inputRef.current.click()}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8
                   flex flex-col items-center gap-2 cursor-pointer
                   hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-gray-800
                   transition-colors"
      >
        <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {uploading ? 'Uploading...' : 'Click to upload or drag & drop'}
        </p>
        <p className="text-xs text-gray-400">JPEG, PNG, WebP · Max 5MB each</p>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Uploading spinner */}
      {uploading && (
        <div className="flex items-center gap-2 text-orange-500">
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Uploading to Cloudinary...</span>
        </div>
      )}

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-2">
          {previews.map((img, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden aspect-square">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full
                           w-6 h-6 flex items-center justify-center opacity-0
                           group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
