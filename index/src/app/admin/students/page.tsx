'use client';

import { useEffect, useState } from "react";
import { StudentsTable } from "@/components/admin/students-table";
import { AddStudentDialog } from "@/components/admin/add-student-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const API_URL = "http://localhost:5000";

type Student = {
  id: number;
  name: string;
  email: string;
  rollNo: string;
  dept: string;
  year: number;
  phone: string;
  roomNo: string | null;
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);

  // ✅ Proper fetch function
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/students`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setStudents(data);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  // Load on page mount
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Students</CardTitle>
          <CardDescription>
            View and manage all enrolled students.
          </CardDescription>
        </div>

        {/* ✅ Now properly defined */}
        <AddStudentDialog onSuccess={fetchStudents} />
      </CardHeader>

      <CardContent>
        <StudentsTable data={students} />
      </CardContent>
    </Card>
  );
}
