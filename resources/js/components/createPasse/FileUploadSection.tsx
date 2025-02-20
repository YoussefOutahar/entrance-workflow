import { useState } from "react";
import { Upload, X, Eye, Download, FileIcon as LucideFileIcon, ImageIcon, FileText } from "lucide-react";
import { Button } from "../ui/button";
import { getFileTypeIcon, canPreviewInBrowser } from "../../utils/fileHelpers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface FileUploadSectionProps {
  files: FileList | null;
  onFilesChange: (files: FileList | null) => void;
  errors: {
    [key: string]: string[];
  };
}

export const FileUploadSection = ({ files, onFilesChange, errors }: FileUploadSectionProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesChange(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      onFilesChange(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    if (!files) return;
    
    const dt = new DataTransfer();
    Array.from(files).forEach((file, i) => {
      if (i !== index) dt.items.add(file);
    });
    onFilesChange(dt.files);
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const CustomFileIcon = ({ type }: { type: string }) => {
    switch (getFileTypeIcon(type)) {
      case 'image':
        return <ImageIcon className="h-5 w-5 text-blue-500" />;
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <LucideFileIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center
          ${dragActive ? 'border-purple-600 bg-purple-50' : 'border-gray-300'}
          ${errors['files.0'] ? 'border-red-500' : ''}
          hover:border-purple-600 transition-colors
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="mt-2 text-sm font-medium text-purple-600">
              Upload files
            </span>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleChange}
            />
          </label>
          <p className="mt-1 text-sm text-gray-500">
            or drag and drop your files here
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Supported formats: PDF, DOC, DOCX, JPG, PNG
          </p>
          {errors['files.0'] && (
            <p className="mt-2 text-sm text-red-500">{errors['files.0'][0]}</p>
          )}
        </div>
      </div>

      {files && Array.from(files).length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Uploaded Files</h4>
          <div className="space-y-2">
            {Array.from(files).map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <CustomFileIcon type={file.type} />
                  <div>
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {canPreviewInBrowser(file.type) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => previewFile(file)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>{file.name}</DialogTitle>
                        </DialogHeader>
                        {file.type.includes('image') ? (
                          <img
                            src={previewUrl!}
                            alt={file.name}
                            className="max-h-[80vh] object-contain"
                          />
                        ) : (
                          <iframe
                            src={previewUrl!}
                            className="w-full h-[80vh]"
                            title={file.name}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadFile(file)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};