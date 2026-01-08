import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ImagePreviewDialog = ({ open, onClose, image }) => {
  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle></DialogTitle>
      </DialogHeader>
      <DialogContent className="max-w-4xl p-2">
        <img
          src={image}
          alt="Preview"
          className="w-full h-auto max-h-[80vh] object-contain rounded"
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
