
import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { mockProjects, mockTimeEntries, getTimeEntriesByEmployee } from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";
import { Calendar, CheckCircle, Clock } from "lucide-react";

const EmployeeDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // For demo purposes, we're using a fixed employee ID
  const employeeId = "2"; // This would normally come from the authenticated user
  
  const [timeEntries] = useState(getTimeEntriesByEmployee(employeeId));
  
  // Calculate some stats for the employee
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
  const projectsWorkedOn = new Set(timeEntries.map(entry => entry.projectId)).size;
  
  // Get active projects that the employee can work on
  const activeProjects = mockProjects.filter(project => project.status === "active");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">نشط</Badge>;
      case "completed":
        return <Badge className="bg-blue-500">مكتمل</Badge>;
      case "paused":
        return <Badge className="bg-yellow-500">متوقف</Badge>;
      default:
        return <Badge>غير معروف</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">مرحباً {user?.name}</h1>
          <Link to="/time-tracking">
            <Button>تسجيل وقت عمل جديد</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">ساعات العمل</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHours} ساعة</div>
              <p className="text-xs text-muted-foreground mt-1">هذا الشهر</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">عدد المشاريع</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projectsWorkedOn}</div>
              <p className="text-xs text-muted-foreground mt-1">مشاريع نشطة</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">آخر تسجيل</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {timeEntries.length > 0 ? timeEntries[0].date : "لا يوجد"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {timeEntries.length > 0 ? `${timeEntries[0].checkIn} - ${timeEntries[0].checkOut}` : ""}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">المشاريع النشطة</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="h-40 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    {getStatusBadge(project.status)}
                  </div>
                  <CardDescription>{project.address}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm line-clamp-2 mb-4">{project.description}</p>
                  <div className="flex justify-end">
                    <Link to="/time-tracking" state={{ project }}>
                      <Button>تسجيل وقت عمل</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">آخر التسجيلات</h2>
          
          {timeEntries.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">لم تقم بتسجيل أي وقت عمل بعد</p>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-right p-3">التاريخ</th>
                    <th className="text-right p-3">المشروع</th>
                    <th className="text-right p-3">وقت الدخول</th>
                    <th className="text-right p-3">وقت الخروج</th>
                    <th className="text-right p-3">إجمالي الساعات</th>
                  </tr>
                </thead>
                <tbody>
                  {timeEntries.map((entry) => {
                    const project = mockProjects.find(p => p.id === entry.projectId);
                    return (
                      <tr key={entry.id} className="border-b">
                        <td className="p-3">{entry.date}</td>
                        <td className="p-3">{project?.name || "غير معروف"}</td>
                        <td className="p-3">{entry.checkIn}</td>
                        <td className="p-3">{entry.checkOut}</td>
                        <td className="p-3">{entry.totalHours} ساعة</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
