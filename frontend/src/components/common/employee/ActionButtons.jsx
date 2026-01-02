import { Button } from "@/components/ui/button";
import { Eye, PencilLine, Trash2 } from "lucide-react";

const ActionButtons = ({ onView, onEdit, onDelete }) => {
  return (
    <div className="space-x-2">
      {onView && (
        <Button
          variant="outline"
          size="sm"
          onClick={onView}
          className="text-blue-800 cursor-pointer hover:text-blue-900"
        >
          <Eye />
        </Button>
      )}
      {onEdit && (
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="text-yellow-500 cursor-pointer hover:text-yellow-600"
        >
          <PencilLine />
        </Button>
      )}

      {onDelete && (
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="text-red-500 cursor-pointer"
        >
          <Trash2 />
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
