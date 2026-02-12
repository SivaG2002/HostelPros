'use client';

import { useEffect, useState } from "react";
import { FeesTable } from "@/components/admin/fees-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const API_URL = "http://localhost:5000";

export default function AdminFeesPage() {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/fees`)
      .then(res => res.json())
      .then(data => setFees(data));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Management</CardTitle>
        <CardDescription>
          Track and manage student fee payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FeesTable fees={fees} />
      </CardContent>
    </Card>
  );
}
