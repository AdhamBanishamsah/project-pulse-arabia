
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { getProjectById, getTimeEntriesByProject, getEmployeeById, mockEmployees } from "../data/mockData";
import { Clock, Edit, User } from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const project = getProjectById(id || "");
  const timeEntries = getTimeEntriesByProject(id || "");
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(project);
  
  if (!project) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-500">المشروع غير موجود</h1>
          <Button className="mt-4" onClick={() => navigate("/admin")}>
            العودة للوحة التحكم
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const handleStatusChange = (status: string) => {
    setEditedProject({ ...editedProject, status: status as any });
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
  
  const saveChanges = () => {
    setIsEditing(false);
    toast({
      title: "تم تحديث المشروع",
      description: "تم تحديث بيانات المشروع بنجاح",
    });
  };
  
  // Calculate project metrics
  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
  const uniqueEmployees = new Set(timeEntries.map(entry => entry.employeeId)).size;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="ml-2 h-4 w-4" />
            تعديل المشروع
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <div className="h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">الحالة:</h2>
                    {getStatusBadge(project.status)}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">تغيير الحالة</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>تغيير حالة المشروع</DialogTitle>
                        <DialogDescription>
                          اختر الحالة الجديدة للمشروع
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Select
                          value={editedProject?.status}
                          onValueChange={handleStatusChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="اختر الحالة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">نشط</SelectItem>
                            <SelectItem value="paused">متوقف</SelectItem>
                            <SelectItem value="completed">مكتمل</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button onClick={saveChanges}>حفظ التغييرات</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">العنوان</h2>
                    <p>{project.address}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-2">الوصف</h2>
                    <p>{project.description}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-2">تاريخ البدء</h2>
                    <p>{project.startDate}</p>
                  </div>
                  {project.endDate && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2">تاريخ الانتهاء</h2>
                      <p>{project.endDate}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إحصائيات المشروع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-viken-blue" />
                    <div>
                      <p className="text-sm text-muted-foreground">إجمالي ساعات العمل</p>
                      <p className="text-xl font-bold">{totalHours} ساعة</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-viken-blue" />
                    <div>
                      <p className="text-sm text-muted-foreground">عدد الموظفين</p>
                      <p className="text-xl font-bold">{uniqueEmployees} موظف</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>الفريق</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from(new Set(timeEntries.map(entry => entry.employeeId))).map(employeeId => {
                    const employee = getEmployeeById(employeeId);
                    if (!employee) return null;
                    
                    return (
                      <div key={employeeId} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-viken-blue flex items-center justify-center text-white">
                          {employee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.title}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="time-entries">
          <TabsList className="mb-4">
            <TabsTrigger value="time-entries">سجلات العمل</TabsTrigger>
            <TabsTrigger value="edit">تعديل المشروع</TabsTrigger>
          </TabsList>
          
          <TabsContent value="time-entries">
            <Card>
              <CardHeader>
                <CardTitle>سجلات العمل</CardTitle>
              </CardHeader>
              <CardContent>
                {timeEntries.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">لا توجد سجلات عمل لهذا المشروع</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted">
                          <th className="text-right p-3">التاريخ</th>
                          <th className="text-right p-3">الموظف</th>
                          <th className="text-right p-3">وقت الدخول</th>
                          <th className="text-right p-3">وقت الخروج</th>
                          <th className="text-right p-3">إجمالي الساعات</th>
                          <th className="text-right p-3">ملاحظات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeEntries.map((entry) => {
                          const employee = getEmployeeById(entry.employeeId);
                          return (
                            <tr key={entry.id} className="border-b">
                              <td className="p-3">{entry.date}</td>
                              <td className="p-3">{employee?.name || "غير معروف"}</td>
                              <td className="p-3">{entry.checkIn}</td>
                              <td className="p-3">{entry.checkOut}</td>
                              <td className="p-3">{entry.totalHours} ساعة</td>
                              <td className="p-3">
                                {entry.notes ? entry.notes.substring(0, 30) + (entry.notes.length > 30 ? "..." : "") : ""}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle>تعديل بيانات المشروع</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">اسم المشروع</Label>
                    <Input
                      id="name"
                      value={editedProject?.name}
                      onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value } as any)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Input
                      id="address"
                      value={editedProject?.address}
                      onChange={(e) => setEditedProject({ ...editedProject, address: e.target.value } as any)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">الوصف</Label>
                    <Textarea
                      id="description"
                      value={editedProject?.description}
                      onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value } as any)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">الحالة</Label>
                    <Select
                      value={editedProject?.status}
                      onValueChange={(value) => setEditedProject({ ...editedProject, status: value } as any)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="اختر الحالة" />
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
                      value={editedProject?.startDate}
                      onChange={(e) => setEditedProject({ ...editedProject, startDate: e.target.value } as any)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">تاريخ الانتهاء</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={editedProject?.endDate || ""}
                      onChange={(e) => setEditedProject({ ...editedProject, endDate: e.target.value } as any)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={saveChanges}>حفظ التغييرات</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ProjectDetails;
