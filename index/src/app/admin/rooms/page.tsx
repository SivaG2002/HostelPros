'use client';

import { useEffect, useState } from "react";
import { RoomsTable } from "@/components/admin/rooms-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { AddRoomDialog } from "@/components/admin/add-room-dialog";


const API_URL = "http://localhost:5000";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    const res = await fetch(`${API_URL}/api/admin/rooms`);
    const data = await res.json();
    setRooms(data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Rooms</CardTitle>
          <CardDescription>
            View room occupancy and assign students.
          </CardDescription>
        </div>
        <AddRoomDialog refresh={fetchRooms} />

      </CardHeader>

      <CardContent>
        <RoomsTable rooms={rooms} refresh={fetchRooms} />
      </CardContent>
    </Card>
  );
}
