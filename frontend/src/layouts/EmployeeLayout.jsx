import EmployeeHeader from "../components/common/employee/EmployeeHeader";
import EmployeeSideBar from "../components/common/employee/EmployeeSideBar";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export default function EmployeeLayout() {
  const { user, setUser, logout } = useContext(AuthContext)
  return (
    <SidebarProvider className="flex h-screen">
      <EmployeeSideBar user={user} setUser={setUser} logout={logout} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <EmployeeHeader user={user} />

        <main className="flex-1 overflow-y-auto">
          {/* <SidebarTrigger /> */}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
