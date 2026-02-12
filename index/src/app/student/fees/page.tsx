'use client';

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CircleDollarSign } from "lucide-react";

type Fee = {
  id: number;
  amount: number;
  due_date: string;
  status: string;
};

type Payment = {
  id: number;
  amount: number;
  payment_date: string;
};

const API_URL = "http://localhost:5000";

export default function StudentFeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const user_id =
    typeof window !== "undefined"
      ? localStorage.getItem("user_id")
      : null;

  useEffect(() => {
    if (!user_id) return;

    // Fee status
    fetch(`${API_URL}/api/student/fees?user_id=${user_id}`)
        .then(res => res.json())
        .then(data => setFees(data));

    // Payment history
    fetch(`${API_URL}/api/student/payments/${user_id}`)
        .then(res => res.json())
        .then(data => setPayments(data));

    }, [user_id]);


  const outstandingFee = fees.find(
    f => f.status.toLowerCase() === "unpaid" || f.status.toLowerCase() === "overdue"
  );

  const getStatusBadge = (status: string) => {
    if (status.toLowerCase() === "paid")
      return <Badge className="bg-green-500 text-white">Paid</Badge>;

    if (status.toLowerCase() === "overdue")
      return <Badge variant="destructive">Overdue</Badge>;

    if (status.toLowerCase() === "unpaid")
      return <Badge variant="secondary">Unpaid</Badge>;

    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-6">

      {/* Current Fee Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-primary" />
            Current Fee Status
          </CardTitle>
        </CardHeader>

        <CardContent>
          {outstandingFee ? (
            <div>
              <p className="text-lg">
                Outstanding payment:
                <strong className="text-primary ml-2">
                  Rs {Number(outstandingFee.amount).toFixed(2)}
                </strong>
              </p>

              <p>Status: {getStatusBadge(outstandingFee.status)}</p>

              <p className="text-sm text-muted-foreground">
                Due Date: {outstandingFee.due_date}
              </p>
            </div>
          ) : (
            <p className="text-lg text-green-600">
              All your fees are paid.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {payments.length > 0 ? (
                  payments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        Rs {Number(payment.amount).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {payment.payment_date}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center text-muted-foreground"
                    >
                      No payment history found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
