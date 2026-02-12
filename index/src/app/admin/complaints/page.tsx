'use client';

import { useEffect, useState } from "react";
import { ComplaintsTable } from "@/components/admin/complaints-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = "http://localhost:5000";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);

  const fetchComplaints = async () => {
    const res = await fetch(`${API_URL}/api/admin/complaints`);
    const data = await res.json();
    setComplaints(data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complaint Management</CardTitle>
        <CardDescription>
          View and resolve student complaints.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ComplaintsTable
          complaints={complaints}
          refresh={fetchComplaints}
        />
      </CardContent>
    </Card>
  );
}
