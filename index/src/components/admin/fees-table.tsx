'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Paid':
      return <Badge className="bg-green-500 text-white">Paid</Badge>;
    case 'Unpaid':
      return <Badge variant="secondary">Unpaid</Badge>;
    case 'Overdue':
      return <Badge variant="destructive">Overdue</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function FeesTable({ fees }: any) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {fees.map((fee: any) => (
            <TableRow key={fee.id}>
              <TableCell className="font-medium">{fee.name}</TableCell>

              <TableCell>Rs{fee.amount}</TableCell>
              <TableCell>{fee.due_date}</TableCell>
              <TableCell>{getStatusBadge(fee.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
