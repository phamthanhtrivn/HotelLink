import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DetailDialog = ({ title, open, onClose, data, fields }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1">
            <div className="text-xs text-muted-foreground">{f.label}</div>
            <div className="font-medium">
              {f.render ? f.render(data) : data?.[f.key] ?? "—"}
            </div>
          </div>
        ))}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose} className="cursor-pointer">
          Đóng
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default DetailDialog;
