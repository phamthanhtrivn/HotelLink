import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DetailDialog = ({ open, onClose, data, fields }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Chi tiết dịch vụ</DialogTitle>
      </DialogHeader>

      <div className="space-y-3">
        {fields.map((f) => (
          <div key={f.key} className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{f.label}: </span>
            <div className="font-medium text-right">
              {f.render
                ? f.render(data)
                : data?.[f.key] ?? "—"}
            </div>
          </div>
        ))}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Đóng
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);


export default DetailDialog;
