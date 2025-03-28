
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, isAuthenticated, isAdmin } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  if (isAuthenticated()) {
    if (isAdmin()) {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      
      // Toast notification for successful login
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في نظام إدارة المشاريع",
      });
      
      // Redirect based on user role
      if (isAdmin()) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      // Display error message
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: error instanceof Error ? error.message : "حدث خطأ أثناء تسجيل الدخول",
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
            <CardTitle className="text-2xl text-center">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center">
              أدخل بيانات الدخول الخاصة بك للوصول إلى حسابك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Link to="/forgot-password" className="text-sm text-viken-blue hover:underline">
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-viken-blue hover:bg-viken-dark-blue"
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-viken-gray">
              ليس لديك حساب؟{" "}
              <Link to="/register" className="text-viken-blue hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center text-sm text-viken-gray">
          <p>للدخول كمدير استخدم: admin@viken.com / password</p>
          <p>للدخول كموظف استخدم: employee@viken.com / password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
