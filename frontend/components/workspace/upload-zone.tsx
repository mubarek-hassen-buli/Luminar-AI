"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { useUploadMaterial } from "@/hooks/use-materials";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  workspaceId: string;
}

export function UploadZone({ workspaceId }: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const uploadMutation = useUploadMaterial();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;
    try {
      await uploadMutation.mutateAsync({ workspaceId, file });
      setFile(null);
    } catch (e) {
      // Error handled by mutation toast
    }
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
            isDragActive ? "border-primary bg-primary/5 scale-[0.99]" : "border-border hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">PDF or DOCX (max. 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-4 flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium max-w-[200px] truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleUpload}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setFile(null)}
              disabled={uploadMutation.isPending}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
