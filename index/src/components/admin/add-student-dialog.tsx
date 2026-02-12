'use client';

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_URL = "http://localhost:5000";

type Room = {
  id: number;
  roomNo: string;
  capacity: number;
  occupied: number;
};

export function AddStudentDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    if (open) {
      fetch(`${API_URL}/api/admin/available-rooms`)
        .then(res => res.json())
        .then(data => setRooms(data));
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await fetch(`${API_URL}/api/admin/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        rollNo: formData.get("rollNo"),
        dept: formData.get("dept"),
        year: formData.get("year"),
        phone: formData.get("phone"),
        room_id: formData.get("room_id"),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(err);
      return;
    }

    setOpen(false);
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Student</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="name" placeholder="Name" required />
          <Input name="email" placeholder="Email" required />
          <Input name="password" placeholder="Password" required />
          <Input name="rollNo" placeholder="Roll No" required />
          <Input name="dept" placeholder="Department" required />
          <Input name="year" placeholder="Year" required />
          <Input name="phone" placeholder="Phone" required />

          <select name="room_id" required className="w-full border p-2 rounded">
            <option value="">Select Available Room</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                {room.roomNo} ({room.capacity - room.occupied} spots left)
              </option>
            ))}
          </select>

          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
