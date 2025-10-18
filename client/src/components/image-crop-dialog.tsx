import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";

interface ImageCropDialogProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImageBase64: string) => void;
}

export function ImageCropDialog({
  open,
  onClose,
  imageSrc,
  onCropComplete,
}: ImageCropDialogProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imgRef.current) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return canvas.toDataURL("image/png");
  }, [completedCrop]);

  const handleCropConfirm = () => {
    const croppedImage = getCroppedImg();
    if (croppedImage) {
      onCropComplete(croppedImage);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Recortar Logo
          </DialogTitle>
          <DialogDescription>
            Ajuste o recorte da imagem para o formato desejado. O logo ficará melhor no PDF se for quadrado ou retangular.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center items-center min-h-[300px] bg-muted/30 rounded-lg p-4">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={undefined}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Recortar"
              className="max-h-[500px] max-w-full"
              data-testid="img-crop-preview"
            />
          </ReactCrop>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-testid="button-cancel-crop"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCropConfirm}
            disabled={!completedCrop}
            data-testid="button-confirm-crop"
          >
            <Scissors className="h-4 w-4 mr-2" />
            Confirmar Recorte
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
