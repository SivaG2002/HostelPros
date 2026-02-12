'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, ListTodo, Users } from "lucide-react";

const API_URL = "http://localhost:5000";

type DashboardData = {
  total_students: number;
  available_rooms: number;
  pending_complaints: number;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/dashboard`)
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  if (!data) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {data.total_students}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently enrolled in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Available Rooms
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {data.available_rooms}
            </div>
            <p className="text-xs text-muted-foreground">
              Rooms with vacant spots
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Complaints
            </CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {data.pending_complaints}
            </div>
            <p className="text-xs text-muted-foreground">
              Complaints awaiting resolution
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
