import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileJson, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

const ParkingData = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFile = (file: File) => {
    if (file && (file.type === 'application/json' || file.name.endsWith('.csv'))) {
      setUploadedFile(file);
      toast({
        title: 'File uploaded!',
        description: `${file.name} is ready to be processed.`,
      });
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JSON or CSV file.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Parking Data</h1>
        <p className="text-muted-foreground">Upload your parking layout and slot configuration</p>
      </div>

      {/* Upload area */}
      <div
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-neon-cyan bg-neon-cyan/5'
            : 'border-border hover:border-muted-foreground/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.csv"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />

        {uploadedFile ? (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slot-available/10">
              <CheckCircle2 className="w-8 h-8 text-slot-available" />
            </div>
            <div>
              <p className="font-semibold">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => setUploadedFile(null)} variant="outline">
                Replace File
              </Button>
              <Button>Process Data</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold">Drop your file here</p>
              <p className="text-sm text-muted-foreground">or click to browse</p>
            </div>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Select File
            </Button>
          </div>
        )}
      </div>

      {/* Supported formats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <FileJson className="text-primary" size={24} />
            <div>
              <p className="font-medium">JSON Format</p>
              <p className="text-xs text-muted-foreground">
                Structured slot data with coordinates
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="text-slot-available" size={24} />
            <div>
              <p className="font-medium">CSV Format</p>
              <p className="text-xs text-muted-foreground">
                Simple tabular slot definitions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingData;
