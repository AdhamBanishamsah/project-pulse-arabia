
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { mockProjects, mockEmployees, mockTimeEntries } from "../data/mockData";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

const Reports = () => {
  const [projectFilter, setProjectFilter] = useState("all");
  
  // Prepare data for project hours chart
  const projectHoursData = mockProjects.map(project => {
    const projectEntries = mockTimeEntries.filter(entry => entry.projectId === project.id);
    const totalHours = projectEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
    
    return {
      name: project.name,
      hours: totalHours
    };
  });
  
  // Prepare data for employee hours chart
  const employeeHoursData = mockEmployees
    .filter(employee => employee.role === "employee")
    .map(employee => {
      const employeeEntries = mockTimeEntries.filter(entry => entry.employeeId === employee.id);
      const totalHours = employeeEntries.reduce((sum, entry) => sum + entry.totalHours, 0);
      
      return {
        name: employee.name,
        hours: totalHours
      };
    });
  
  // Prepare data for pie chart (project distribution)
  const projectDistribution = projectHoursData.map((project, index) => ({
    name: project.name,
    value: project.hours
  }));
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">التقارير</h1>
        
        <div className="flex items-end gap-4 mb-4">
          <div className="w-64">
            <Label htmlFor="projectFilter" className="mb-2 block">تصفية حسب المشروع</Label>
            <Select
              value={projectFilter}
              onValueChange={setProjectFilter}
            >
              <SelectTrigger id="projectFilter">
                <SelectValue placeholder="اختر المشروع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المشاريع</SelectItem>
                {mockProjects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="projects">
          <TabsList className="mb-4">
            <TabsTrigger value="projects">تقارير المشاريع</TabsTrigger>
            <TabsTrigger value="employees">تقارير الموظفين</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>ساعات العمل حسب المشروع</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={projectHoursData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <XAxis dataKey="name" angle={-45} textAnchor="end" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="hours" name="ساعات العمل" fill="#1EAEDB" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>توزيع ساعات العمل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={projectDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {projectDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} ساعة`, 'ساعات العمل']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>تفاصيل ساعات العمل حسب المشروع</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-right p-3">المشروع</th>
                        <th className="text-right p-3">العنوان</th>
                        <th className="text-right p-3">الحالة</th>
                        <th className="text-right p-3">تاريخ البدء</th>
                        <th className="text-right p-3">إجمالي الساعات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectHoursData.map((project, index) => {
                        const projectDetails = mockProjects[index];
                        return (
                          <tr key={index} className="border-b">
                            <td className="p-3">{project.name}</td>
                            <td className="p-3">{projectDetails.address}</td>
                            <td className="p-3">
                              {projectDetails.status === "active" && "نشط"}
                              {projectDetails.status === "completed" && "مكتمل"}
                              {projectDetails.status === "paused" && "متوقف"}
                            </td>
                            <td className="p-3">{projectDetails.startDate}</td>
                            <td className="p-3">{project.hours} ساعة</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>ساعات العمل حسب الموظف</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={employeeHoursData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <XAxis dataKey="name" angle={-45} textAnchor="end" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hours" name="ساعات العمل" fill="#F97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>تفاصيل ساعات العمل حسب الموظف</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="text-right p-3">الموظف</th>
                        <th className="text-right p-3">البريد الإلكتروني</th>
                        <th className="text-right p-3">المسمى الوظيفي</th>
                        <th className="text-right p-3">تاريخ الانضمام</th>
                        <th className="text-right p-3">إجمالي الساعات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeHoursData.map((employee, index) => {
                        const employeeDetails = mockEmployees.find(e => e.name === employee.name);
                        if (!employeeDetails) return null;
                        
                        return (
                          <tr key={index} className="border-b">
                            <td className="p-3">{employee.name}</td>
                            <td className="p-3">{employeeDetails.email}</td>
                            <td className="p-3">{employeeDetails.title || "غير محدد"}</td>
                            <td className="p-3">{employeeDetails.joinDate}</td>
                            <td className="p-3">{employee.hours} ساعة</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
