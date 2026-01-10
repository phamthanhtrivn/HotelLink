import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const EditCreateModal = ({ open, onClose, title, children, onSubmit, className, loading = false }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className={className}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>

      {children}

      <DialogFooter>
        <Button disabled={loading} onClick={onSubmit} className="cursor-pointer bg-(--color-primary) hover:bg-[#2a4b70]">
           {loading && <Loader2 className="animate-spin h-5 w-5"/>} Lưu
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default EditCreateModal;
