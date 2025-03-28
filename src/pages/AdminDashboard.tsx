
import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { mockProjects, mockEmployees, getPendingEmployees, Project } from "../data/mockData";
import { Calendar, ChartBar, Clock, Users } from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState(mockProjects);
  const [pendingEmployees] = useState(getPendingEmployees());
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    address: "",
    description: "",
    status: "active",
    startDate: new Date().toISOString().substring(0, 10),
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateProject = () => {
    const projectId = (projects.length + 1).toString();
    const project = {
      ...newProject,
      id: projectId,
      image: `https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop`,
      status: newProject.status as "active" | "completed" | "paused",
    } as Project;
    
    setProjects([...projects, project]);
    setNewProject({
      name: "",
      address: "",
      description: "",
      status: "active",
      startDate: new Date().toISOString().substring(0, 10),
    });
    setIsDialogOpen(false);
    
    toast({
      title: "تم إنشاء المشروع",
      description: "تم إنشاء المشروع بنجاح",
    });
  };
  
  const approveEmployee = (id: string) => {
    toast({
      title: "تم الموافقة على الموظف",
      description: "تم تفعيل حساب الموظف بنجاح",
    });
  };

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
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>إضافة مشروع جديد</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>إضافة مشروع جديد</DialogTitle>
                <DialogDescription>أدخل بيانات المشروع الجديد</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">اسم المشروع</Label>
                  <Input
                    id="name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    value={newProject.address}
                    onChange={(e) => setNewProject({ ...newProject, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">الحالة</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value) => setNewProject({ ...newProject, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر حالة المشروع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="paused">متوقف</SelectItem>
                      <SelectItem value="completed">مكتمل</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">تاريخ البدء</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleCreateProject}>إنشاء المشروع</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي المشاريع</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {projects.filter(p => p.status === "active").length} مشاريع نشطة
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الموظفين</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockEmployees.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingEmployees.length} بانتظار الموافقة
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي ساعات العمل</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground mt-1">هذا الشهر</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">متوسط الساعات اليومية</CardTitle>
              <ChartBar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7.5</div>
              <p className="text-xs text-muted-foreground mt-1">لكل موظف</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="projects">
          <TabsList className="mb-4">
            <TabsTrigger value="projects">المشاريع</TabsTrigger>
            <TabsTrigger value="employees">الموظفين بانتظار الموافقة</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
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
                      <Link to={`/admin/projects/${project.id}`}>
                        <Button variant="outline">عرض التفاصيل</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="employees">
            {pendingEmployees.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">لا يوجد موظفين بانتظار الموافقة</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingEmployees.map((employee) => (
                  <Card key={employee.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-viken-blue flex items-center justify-center text-white text-lg">
                            {employee.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium">{employee.name}</h3>
                            <p className="text-sm text-muted-foreground">{employee.email}</p>
                          </div>
                        </div>
                        <Button onClick={() => approveEmployee(employee.id)}>موافقة</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
