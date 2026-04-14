"use client";

import { useRef, useState } from "react";

import Image from "next/image";
import { Loader2, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
  onUploadStateChange?: (isUploading: boolean) => void;
  max?: number;
};

export function ImageUploader({ images, onChange, onUploadStateChange, max = 5 }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    if (images.length + files.length > max) {
      alert(`يمكنك رفع ${max} صور كحد أقصى`);
      return;
    }

    setIsUploading(true);
    onUploadStateChange?.(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("تعذر قراءة الملف"));
          reader.readAsDataURL(file);
        });

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.error ?? "فشل رفع الصورة");
        }

        if (result.url && typeof result.url === "string") {
          uploadedUrls.push(result.url);
        } else {
          throw new Error("لم تحتوي الاستجابة على رابط صورة صحيح");
        }
      }

      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "حدث خطأ أثناء رفع الصور");
    } finally {
      setIsUploading(false);
      onUploadStateChange?.(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <div className="space-y-3">
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <Image
                src={url}
                alt={`صورة ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />
              {index === 0 ? (
                <span className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-center text-[10px] text-white">
                  رئيسية
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute inset-e-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {images.length < max ? (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => handleFiles(event.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            className="h-24 w-full flex-col gap-2 border-dashed"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-xs">جاري الرفع...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  اضغط لرفع الصور ({images.length}/{max})
                </span>
              </>
            )}
          </Button>
        </>
      ) : null}
    </div>
  );
}
