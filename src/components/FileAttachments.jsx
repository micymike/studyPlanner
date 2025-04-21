import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, X, Download, Eye, File, Image, FileText } from 'lucide-react';
import { getItem, setItem, STORAGE_KEYS } from '../utils/localStorage';
import { fileToDataURL, dataURLToFile, getFileSize, isImageFile, isDocumentFile } from '../utils/fileUtils';

export default function FileAttachments({ parentId, parentType = 'assignment' }) {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const fileInput = useRef(null);

  // Load files from localStorage on mount
  useEffect(() => {
    if (!parentId) return;
    
    const allFiles = getItem(STORAGE_KEYS.FILES, {});
    const key = `${parentType}_${parentId}`;
    setFiles(allFiles[key] || []);
  }, [parentId, parentType]);

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (!parentId) return;
    
    const allFiles = getItem(STORAGE_KEYS.FILES, {});
    const key = `${parentType}_${parentId}`;
    allFiles[key] = files;
    setItem(STORAGE_KEYS.FILES, allFiles);
  }, [files, parentId, parentType]);

  // Handle file selection
  const handleFileSelect = async (e) => {
    if (!parentId) {
      alert('Cannot attach files without a parent ID');
      return;
    }
    
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    
    setIsUploading(true);
    
    try {
      const newFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          const dataURL = await fileToDataURL(file);
          return {
            id: Date.now() + Math.random().toString(36).substring(2, 9),
            name: file.name,
            type: file.type,
            size: file.size,
            dataURL,
            createdAt: new Date().toISOString(),
          };
        })
      );
      
      setFiles([...files, ...newFiles]);
    } catch (error) {
      console.error('Error processing files:', error);
      alert('Error processing files. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInput.current) {
        fileInput.current.value = '';
      }
    }
  };

  // Delete a file
  const deleteFile = (id) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setFiles(files.filter(file => file.id !== id));
    }
  };

  // Download a file
  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.dataURL;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Preview a file
  const previewFileHandler = (file) => {
    setPreviewFile(file);
  };

  // Close preview
  const closePreview = () => {
    setPreviewFile(null);
  };

  // Get file icon based on type
  const getFileIcon = (file) => {
    if (isImageFile({ type: file.type })) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (isDocumentFile({ type: file.type })) {
      return <FileText className="h-5 w-5 text-green-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium flex items-center">
          <Paperclip className="h-4 w-4 mr-1 text-gray-500" />
          Attachments ({files.length})
        </h3>
        
        <input
          type="file"
          ref={fileInput}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />
        
        <button
          className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
          onClick={() => fileInput.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Add Files'}
        </button>
      </div>
      
      {/* File List */}
      {files.length > 0 ? (
        <div className="space-y-2 mt-2">
          {files.map((file) => (
            <div 
              key={file.id} 
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200"
            >
              <div className="flex items-center overflow-hidden">
                {getFileIcon(file)}
                <span className="ml-2 text-sm truncate">{file.name}</span>
                <span className="ml-2 text-xs text-gray-500">{getFileSize(file.size)}</span>
              </div>
              
              <div className="flex space-x-1">
                {isImageFile({ type: file.type }) && (
                  <button
                    className="p-1 text-gray-500 hover:text-blue-600"
                    onClick={() => previewFileHandler(file)}
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                
                <button
                  className="p-1 text-gray-500 hover:text-green-600"
                  onClick={() => downloadFile(file)}
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                
                <button
                  className="p-1 text-gray-500 hover:text-red-600"
                  onClick={() => deleteFile(file.id)}
                  title="Delete"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-gray-500 bg-gray-50 rounded-md">
          No files attached. Click "Add Files" to attach files.
        </div>
      )}
      
      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">{previewFile.name}</h3>
              <button
                className="p-1 text-gray-500 hover:text-gray-700"
                onClick={closePreview}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-auto">
              {isImageFile({ type: previewFile.type }) ? (
                <img 
                  src={previewFile.dataURL} 
                  alt={previewFile.name} 
                  className="max-w-full max-h-[70vh] mx-auto"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  {getFileIcon(previewFile)}
                  <p className="mt-2 text-gray-500">Preview not available for this file type</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => downloadFile(previewFile)}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
