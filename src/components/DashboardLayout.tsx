
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
  SidebarProvider,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "../contexts/AuthContext";
import { 
  Calendar, 
  Home, 
  Clock, 
  ChartBar, 
  Users, 
  Settings, 
  LogOut, 
  FileText,
} from "lucide-react";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminMenuItems = [
    {
      title: "لوحة التحكم",
      url: "/admin",
      icon: Home,
      active: location.pathname === "/admin",
    },
    {
      title: "الموظفين",
      url: "/admin/employees",
      icon: Users,
      active: location.pathname === "/admin/employees",
    },
    {
      title: "التقارير",
      url: "/admin/reports",
      icon: ChartBar,
      active: location.pathname === "/admin/reports",
    },
    {
      title: "الإعدادات",
      url: "/admin/settings",
      icon: Settings,
      active: location.pathname === "/admin/settings",
    },
  ];

  const employeeMenuItems = [
    {
      title: "الرئيسية",
      url: "/dashboard",
      icon: Home,
      active: location.pathname === "/dashboard",
    },
    {
      title: "تسجيل الوقت",
      url: "/time-tracking",
      icon: Clock,
      active: location.pathname === "/time-tracking",
    },
    {
      title: "تقاريري",
      url: "/my-reports",
      icon: FileText,
      active: location.pathname === "/my-reports",
    },
    {
      title: "الجدول الزمني",
      url: "/calendar",
      icon: Calendar,
      active: location.pathname === "/calendar",
    },
  ];

  const menuItems = isAdmin() ? adminMenuItems : employeeMenuItems;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-l">
          <SidebarHeader className="p-4 border-b">
            <div className="text-center">
              <h1 className="text-xl font-bold text-viken-blue">فيكن باد</h1>
              <p className="text-sm text-viken-gray">نظام إدارة المشاريع</p>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>{isAdmin() ? "لوحة المدير" : "لوحة الموظف"}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild active={item.active}>
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-viken-blue flex items-center justify-center text-white">
                  {user?.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleLogout}
              >
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center px-6 justify-between">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
