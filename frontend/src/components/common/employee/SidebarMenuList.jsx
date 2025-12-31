import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const SidebarMenuList = ({ items }) => {
  const location = useLocation();

  return items.map((item) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.url;

    return (
      <SidebarMenuItem key={item.url} className="mb-1">
        <Link to={item.url} className="block">
          <SidebarMenuButton
            isActive={isActive}
            className={`
              transition-all duration-200 cursor-pointer
              ${
                isActive
                  ? "bg-blue-500 text-white border-r-4 border-[#1E2A38] font-bold"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }
            `}
          >
            <Icon
              className={`${isActive ? "text-[#1E2A38]" : "text-slate-500"}`}
            />
            <span className="font-medium">{item.name}</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    );
  });
};

export default SidebarMenuList;
