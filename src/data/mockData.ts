
// Mock data types
export type Project = {
  id: string;
  name: string;
  address: string;
  image: string;
  status: "active" | "completed" | "paused";
  startDate: string;
  endDate?: string;
  description: string;
};

export type Employee = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  approved: boolean;
  title?: string;
  joinDate: string;
  avatar?: string;
};

export type TimeEntry = {
  id: string;
  projectId: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  notes?: string;
  photoUrl?: string;
  totalHours: number;
};

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: "1",
    name: "فيلا السعادة",
    address: "شارع النخيل، حي الروضة، الرياض",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop",
    status: "active",
    startDate: "2023-10-15",
    description: "تجديد كامل للمنزل مع تركيب أحواض استحمام جديدة وتحديث الحمامات"
  },
  {
    id: "2",
    name: "مجمع النرجس السكني",
    address: "طريق الملك فهد، حي النرجس، جدة",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    status: "active",
    startDate: "2023-11-05",
    description: "تركيب أحواض استحمام وتجهيزات صحية للمجمع السكني الجديد"
  },
  {
    id: "3",
    name: "فندق الواحة",
    address: "شارع الأمير سلطان، حي الخبر الشمالية، الخبر",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
    status: "completed",
    startDate: "2023-08-01",
    endDate: "2023-12-20",
    description: "تحديث كامل لحمامات الفندق وتركيب أحواض استحمام فاخرة"
  },
  {
    id: "4",
    name: "مستشفى الصحة",
    address: "طريق الملك عبدالله، حي الملقا، الرياض",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
    status: "paused",
    startDate: "2024-01-10",
    description: "تجهيز الحمامات والمرافق الصحية للمستشفى الجديد"
  }
];

// Mock Employees
export const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "محمد علي",
    email: "mohammad@viken.com",
    role: "admin",
    approved: true,
    title: "مدير مشاريع",
    joinDate: "2022-05-10",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "2",
    name: "أحمد الناصر",
    email: "ahmed@viken.com",
    role: "employee",
    approved: true,
    title: "فني تركيب",
    joinDate: "2022-08-15",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    name: "خالد القحطاني",
    email: "khalid@viken.com",
    role: "employee",
    approved: true,
    title: "فني تركيب",
    joinDate: "2023-01-20",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "4",
    name: "فيصل الشمري",
    email: "faisal@viken.com",
    role: "employee",
    approved: false,
    title: "مساعد فني",
    joinDate: "2024-02-05",
    avatar: "https://i.pravatar.cc/150?img=4"
  }
];

// Mock Time Entries
export const mockTimeEntries: TimeEntry[] = [
  {
    id: "1",
    projectId: "1",
    employeeId: "2",
    date: "2024-06-01",
    checkIn: "08:00",
    checkOut: "15:30",
    notes: "تم تركيب 3 أحواض في الطابق الأول",
    photoUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
    totalHours: 7.5
  },
  {
    id: "2",
    projectId: "1",
    employeeId: "3",
    date: "2024-06-01",
    checkIn: "08:30",
    checkOut: "16:00",
    notes: "تم تركيب أنابيب الصرف للحمامات",
    photoUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop",
    totalHours: 7.5
  },
  {
    id: "3",
    projectId: "2",
    employeeId: "2",
    date: "2024-06-02",
    checkIn: "07:45",
    checkOut: "16:30",
    notes: "تم البدء في تركيب أحواض الطابق الثاني",
    photoUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    totalHours: 8.75
  },
  {
    id: "4",
    projectId: "3",
    employeeId: "3",
    date: "2024-06-03",
    checkIn: "08:00",
    checkOut: "14:00",
    notes: "تم الانتهاء من تركيب جميع الأحواض",
    photoUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
    totalHours: 6
  }
];

// Helper functions to get data
export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(project => project.id === id);
};

export const getTimeEntriesByProject = (projectId: string): TimeEntry[] => {
  return mockTimeEntries.filter(entry => entry.projectId === projectId);
};

export const getTimeEntriesByEmployee = (employeeId: string): TimeEntry[] => {
  return mockTimeEntries.filter(entry => entry.employeeId === employeeId);
};

export const getEmployeeById = (id: string): Employee | undefined => {
  return mockEmployees.find(employee => employee.id === id);
};

export const getPendingEmployees = (): Employee[] => {
  return mockEmployees.filter(employee => !employee.approved);
};
