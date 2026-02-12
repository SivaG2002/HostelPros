export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  avatarUrl: string;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  roomId: string | null;
}

export interface Room {
  id: string;
  roomNumber: string;
  capacity: number;
  occupants: string[]; // array of student IDs
}

export interface Fee {
  id:string;
  studentId: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
}

export interface Complaint {
  id: string;
  studentId: string;
  title: string;
  description: string;
  date: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  summary: string;
  date: string;
}
