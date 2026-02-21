'use client';

import { useEffect, useState } from "react";
import { AddStudentDialog } from "@/components/admin/add-student-dialog";
import { StudentsTable } from "@/components/admin/students-table";
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
  is_active: boolean;
  leave_reason: string | null;
};

type DeletedStudent = {
  id: number;
  user_id: number;
  name: string;
  email: string;
  rollNo: string;
  dept: string;
  year: number;
  phone: string;
  deleted_at: string;
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [deletedStudents, setDeletedStudents] = useState<DeletedStudent[]>([]);

  const fetchStudents = async () => {
    const res = await fetch(`${API_URL}/api/admin/students`);
    const data = await res.json();
    setStudents(data);
  };

  const fetchDeletedStudents = async () => {
    const res = await fetch(`${API_URL}/api/admin/deleted-students`);
    const data = await res.json();
    setDeletedStudents(data);
  };

  useEffect(() => {
    fetchStudents();
    fetchDeletedStudents();
  }, []);

  const total = students.length;
  const active = students.filter(s => s.is_active).length;
  const inactive = total - active;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
  <div>
    <CardTitle>Manage Students</CardTitle>

    <CardDescription className="space-x-6 text-sm mt-2">
      <span className="text-green-600 font-semibold">
        Total: {total}
      </span>
      <span className="text-blue-600 font-semibold">
        Active: {active}
      </span>
      <span className="text-red-600 font-semibold">
        Non Active: {inactive}
      </span>
    </CardDescription>
  </div>

  {/* ✅ Add Student Button */}
  <AddStudentDialog onSuccess={fetchStudents} />
</CardHeader>


        <CardContent>
          <StudentsTable
            data={students}
            refresh={fetchStudents}
            refreshDeleted={fetchDeletedStudents}
          />
        </CardContent>
      </Card>

      {/* Permanently Deleted Students */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Students Permanently Deleted</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Roll No</th>
                  <th className="p-3 text-left">Deleted At</th>
                </tr>
              </thead>

              <tbody>
                {deletedStudents.map(student => (
                  <tr key={student.id} className="border-b">
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.rollNo}</td>
                    <td className="p-3">
                      {student.deleted_at
                        ? new Date(student.deleted_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}

                {deletedStudents.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center p-4 text-muted-foreground">
                      No students permanently deleted.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
