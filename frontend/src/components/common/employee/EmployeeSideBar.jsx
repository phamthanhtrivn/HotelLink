import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";

const EmployeeSideBar = () => {
  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="px-4 py-6 border-b border-slate-200"></SidebarHeader>

      <SidebarContent className="px-3 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu></SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-200"></SidebarFooter>
    </Sidebar>
  );
};

export default EmployeeSideBar;
