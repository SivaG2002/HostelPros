'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const API_URL = "http://localhost:5000";

type Student = {
  id: number;
  name: string;
  email: string;
  rollNo: string;
  roomNo: string | null;
  is_active: boolean;
  leave_reason: string | null;
};

export function StudentsTable({
  data,
  refresh,
  refreshDeleted
}: {
  data: Student[];
  refresh: () => void;
  refreshDeleted: () => void;
}) {

  const toggleActivity = async (id: number, current: boolean) => {
    await fetch(`${API_URL}/api/admin/student/activity/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !current })
    });

    refresh();
  };

  const removeStudent = async (id: number) => {
    if (!confirm("Are you sure you want to permanently remove this student?"))
      return;

    await fetch(`${API_URL}/api/admin/student/remove/${id}`, {
      method: "DELETE",
    });

    refresh();
    refreshDeleted();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Roll No</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map(student => {

            const initials = student.name
              .split(" ")
              .map(n => n[0])
              .join("");

            return (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{student.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {student.email}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell>{student.rollNo}</TableCell>

                <TableCell>
                  {student.roomNo
                    ? <Badge variant="outline">Room {student.roomNo}</Badge>
                    : <Badge variant="secondary">Unassigned</Badge>
                  }
                </TableCell>

                <TableCell>
                  {student.is_active ? (
                    <Badge className="bg-green-500 text-white">
                      Active
                    </Badge>
                  ) : (
                    <div>
                      <Badge variant="destructive">
                        Inactive
                      </Badge>

                      {student.leave_reason && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {student.leave_reason}
                        </div>
                      )}
                    </div>
                  )}
                </TableCell>

                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleActivity(student.id, student.is_active)}
                  >
                    {student.is_active ? "Mark Inactive" : "Mark Active"}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeStudent(student.id)}
                  >
                    Remove
                  </Button>
                </TableCell>

              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
