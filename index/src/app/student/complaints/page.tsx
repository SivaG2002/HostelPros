'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

type Complaint = {
  id: number;
  title: string;
  description: string;
  status: string;
  date: string;
};

const API_URL = "http://localhost:5000";

export default function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const user_id = typeof window !== "undefined"
    ? localStorage.getItem("user_id")
    : null;

  useEffect(() => {
    if (!user_id) return;

    fetch(`${API_URL}/api/student/my-complaints/${user_id}`)
      .then(res => res.json())
      .then(data => setComplaints(data));
  }, [user_id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch(`${API_URL}/api/student/my-complaints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: user_id,
        title,
        description,
      }),
    });

    setTitle("");
    setDescription("");

    // reload complaints
    const res = await fetch(`${API_URL}/api/student/my-complaints/${user_id}`);
    const data = await res.json();
    setComplaints(data);
  }

  const getStatusBadge = (status: string) => {
    if (status === "resolved")
      return <Badge className="bg-green-500 text-white">Resolved</Badge>;

    if (status === "pending")
      return <Badge variant="destructive">Pending</Badge>;

    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Submit a Complaint</CardTitle>
            <CardDescription>Have an issue? Let us know.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label>Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Complaint
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>My Complaint History</CardTitle>
            <CardDescription>
              Track the status of your submitted complaints.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {complaints.length > 0 ? (
                  complaints.map(c => (
                    <TableRow key={c.id}>
                      <TableCell>{c.title}</TableCell>
                      <TableCell>{c.date}</TableCell>
                      <TableCell>{getStatusBadge(c.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No complaints yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
