'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000";

export function RoomsTable({ rooms, refresh }: any) {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [unassigned, setUnassigned] = useState<any[]>([]);

  // Load unassigned students
  useEffect(() => {
    fetch(`${API_URL}/api/admin/unassigned-students`)
      .then(res => res.json())
      .then(data => setUnassigned(data));
  }, []);

  async function allocate(roomId: number) {
    if (!selectedStudent) return;

    await fetch(`${API_URL}/api/admin/allocate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: selectedStudent,
        room_id: roomId,
      }),
    });

    setSelectedStudent("");
    refresh();
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room</TableHead>
            <TableHead>Occupancy</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Assign</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rooms.map((room: any) => {
            const percentage = (room.occupied / room.capacity) * 100;
            const isFull = room.occupied >= room.capacity;

            return (
              <TableRow key={room.id}>
                <TableCell>{room.roomNo}</TableCell>

                <TableCell>
                  <Progress value={percentage} className="w-[120px]" />
                  <div className="text-sm text-muted-foreground">
                    {room.occupied}/{room.capacity}
                  </div>
                </TableCell>

                <TableCell>
                  {room.students?.map((s: any) => (
                    <div key={s.id}>{s.name}</div>
                  ))}
                </TableCell>

                <TableCell>
                  {isFull ? (
                    <Button disabled size="sm">Full</Button>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                      >
                        <option value="">Select Student</option>
                        {unassigned.map((student: any) => (
                          <option key={student.id} value={student.id}>
                            {student.name}
                          </option>
                        ))}
                      </select>

                      <Button size="sm" onClick={() => allocate(room.id)}>
                        Allocate
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
