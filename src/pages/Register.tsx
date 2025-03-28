
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "خطأ في التسجيل",
        description: "كلمة المرور وتأكيد كلمة المرور غير متطابقين",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(name, email, password);
      
      toast({
        title: "تم التسجيل بنجاح",
        description: "تم إنشاء حسابك وبانتظار موافقة المدير",
      });
      
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ في التسجيل",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء التسجيل",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-viken-light-gray p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-viken-blue">فيكن باد</h1>
          <p className="text-viken-gray mt-2">نظام إدارة المشاريع وتتبع الوقت</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">إنشاء حساب جديد</CardTitle>
            <CardDescription className="text-center">
              أدخل بياناتك لإنشاء حساب جديد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="الاسم الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-viken-blue hover:bg-viken-dark-blue"
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري التسجيل..." : "إنشاء حساب"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-viken-gray">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="text-viken-blue hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
