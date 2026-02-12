'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const API_URL = "http://localhost:5000";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'resolved':
      return <Badge className="bg-green-500 text-white">Resolved</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
    case 'pending':
      return <Badge variant="destructive">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function ComplaintsTable({ complaints, refresh }: any) {

  const updateStatus = async (id: number, status: string) => {
    await fetch(`${API_URL}/api/admin/complaints/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    refresh();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Complaint</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {complaints.map((c: any) => (
            <TableRow key={c.id}>
              <TableCell>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-muted-foreground">
                  {c.description}
                </div>
              </TableCell>

              <TableCell>{c.studentName}</TableCell>
              <TableCell>{c.created_at}</TableCell>

              <TableCell>
                {getStatusBadge(c.status)}
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => updateStatus(c.id, "pending")}
                    >
                      Mark as Pending
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => updateStatus(c.id, "in_progress")}
                    >
                      Mark as In Progress
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => updateStatus(c.id, "resolved")}
                    >
                      Mark as Resolved
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
