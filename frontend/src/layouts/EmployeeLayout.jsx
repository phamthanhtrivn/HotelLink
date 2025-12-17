import EmployeeHeader from "../components/common/employee/EmployeeHeader";
import EmployeeSideBar from "../components/common/employee/EmployeeSideBar";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function EmployeeLayout() {
  return (
    <SidebarProvider className="flex h-screen">
      <EmployeeSideBar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <EmployeeHeader />

        <main className="flex-1 overflow-y-auto">
          {/* <SidebarTrigger /> */}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
