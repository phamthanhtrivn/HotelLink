import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { personService } from "@/services/personService";
import { Loader2 } from "lucide-react";
import { authService } from "@/services/authService";

const AdminProfileModal = ({
  open,
  onClose,
  isLoading,
  infor,
  setInfor,
  setUser,
}) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processingPassword, setProcessingPassword] = useState(false);

  const handleChangeInfo = async () => {
    setProcessing(true);
    try {
      const updateData = {
        fullName,
        phone,
      };
      const res = await personService.updatePersonById(
        infor?.userId,
        updateData
      );
      if (res.success) {
        setInfor(res.data);
        toast.success(res.message);
        setUser({
          userId: res.data.user.id,
          fullName: res.data.fullName,
          phone: res.data.phone,
          email: res.data.user.email,
          role: res.data.user.role,
        });
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi thay đổi thông tin");
    } finally {
      setProcessing(false);
    }
  };

  const handleChangePassword = async () => {
    setProcessingPassword(true);
    try {
      const res = await authService.forgotPassword(infor?.user.email);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi thay đổi mật khẩu");
    } finally {
      setProcessingPassword(false);
    }
  };

  useEffect(() => {
    if (infor) {
      setFullName(infor?.fullName);
      setPhone(infor?.phone);
    }
  }, [infor]);

  if (!infor) return null;

  if (isLoading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        <Loader2 className="w-16 h-16 text-[#1E2A38] animate-spin" />
      </div>
    );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex justify-between mr-10 ">
            Thông tin quản trị viên
            <Badge className="bg-(--color-primary)">{infor?.user.role}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <Label>Email</Label>
            <Input value={infor?.user.email} readOnly />
          </div>

          {/* Full name */}
          <div className="space-y-1">
            <Label>Họ và tên</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label>Số điện thoại</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onClose(false)}
          >
            Hủy
          </Button>
          <Button
            onClick={handleChangePassword}
            className="cursor-pointer bg-(--color-primary) hover:bg-[#2a4b70]"
          >
            {processingPassword ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xử lý...
              </div>
            ) : (
              `Thay đổi mật khẩu`
            )}
          </Button>
          <Button
            onClick={handleChangeInfo}
            className="cursor-pointer bg-(--color-primary) hover:bg-[#2a4b70]"
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xử lý...
              </div>
            ) : (
              `Cập nhật`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminProfileModal;
