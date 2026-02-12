'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, CircleDollarSign, User } from "lucide-react";

const API_URL = "http://127.0.0.1:5000";

export default function StudentDashboardPage() {
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (!userId) return;

    fetch(`${API_URL}/api/student/${userId}`)
      .then(res => res.json())
      .then(data => setStudent(data));
  }, []);

  if (!student) return <div>Loading...</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {student.name}</p>
          <p><strong>Email:</strong> {student.email}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BedDouble className="h-5 w-5" />
            Room
          </CardTitle>
        </CardHeader>
        <CardContent>
          {student.roomNo
            ? <p>Room: {student.roomNo}</p>
            : <p>Not allocated</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5" />
            Fees
          </CardTitle>
        </CardHeader>
        <CardContent>
          {student.feeStatus ? (
            <div>
              <Badge>{student.feeStatus}</Badge>
              <p>Amount: ₹{student.amount}</p>
            </div>
          ) : (
            <p>No fee record</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
