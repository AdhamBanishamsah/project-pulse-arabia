
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { mockProjects } from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";
import { Clock, FileText, Upload } from "lucide-react";

const TimeTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Check if a project was passed via location state
  const initialProject = location.state?.project ? location.state.project.id : "";
  
  const [formData, setFormData] = useState({
    projectId: initialProject,
    date: new Date().toISOString().substring(0, 10),
    checkIn: "",
    checkOut: "",
    notes: "",
    photo: null as File | null,
  });
  
  const [photoPreview, setPhotoPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, photo: file });
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.projectId) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى اختيار المشروع",
      });
      return;
    }
    
    if (!formData.checkIn || !formData.checkOut) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "يرجى إدخال وقت الدخول والخروج",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم تسجيل الوقت بنجاح",
        description: "تم إضافة تسجيل الوقت للمشروع",
      });
      
      // Navigate back to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الوقت",
        description: "حدث خطأ أثناء تسجيل الوقت",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">تسجيل وقت العمل</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>إدخال بيانات وقت العمل</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project">المشروع</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المشروع" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProjects
                      .filter(project => project.status === "active")
                      .map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">التاريخ</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkIn">وقت الدخول</Label>
                  <div className="flex items-center">
                    <Clock className="ml-2 h-4 w-4" />
                    <Input
                      id="checkIn"
                      type="time"
                      value={formData.checkIn}
                      onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOut">وقت الخروج</Label>
                  <div className="flex items-center">
                    <Clock className="ml-2 h-4 w-4" />
                    <Input
                      id="checkOut"
                      type="time"
                      value={formData.checkOut}
                      onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <div className="flex items-center">
                  <FileText className="ml-2 h-4 w-4" />
                  <Textarea
                    id="notes"
                    placeholder="أدخل ملاحظات حول العمل المنجز"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo">صورة للعمل المنجز</Label>
                <div className="flex items-center">
                  <Upload className="ml-2 h-4 w-4" />
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>
              
              {photoPreview && (
                <div className="mt-4">
                  <p className="text-sm mb-2">معاينة الصورة:</p>
                  <img 
                    src={photoPreview} 
                    alt="معاينة" 
                    className="max-h-60 rounded-md border"
                  />
                </div>
              )}
              
              <div className="flex justify-end mt-6">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "جاري التسجيل..." : "تسجيل وقت العمل"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TimeTracking;
