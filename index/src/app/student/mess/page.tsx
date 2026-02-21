import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Utensils } from "lucide-react";

export default function StudentMessPage() {
  const menu = [
    {
      day: "Monday",
      morning: "Puttu & Kadala Curry",
      afternoon: "Matta Rice, Sambar, Avial, Thoran, Pickle",
      evening: "Tea & Pazham Pori",
      night: "Chapathi & Vegetable Kurma",
    },
    {
      day: "Tuesday",
      morning: "Appam & Vegetable Stew",
      afternoon: "Matta Rice, Moru Curry, Mezhukkupuratti, Pappadam",
      evening: "Tea & Parippu Vada",
      night: "Dosa & Chutney",
    },
    {
      day: "Wednesday",
      morning: "Idiyappam & Egg Curry",
      afternoon: "Matta Rice, Sambar, Kootu Curry, Cabbage Thoran",
      evening: "Tea & Unniyappam",
      night: "Lemon Rice & Pickle",
    },
    {
      day: "Thursday",
      morning: "Dosa & Sambar",
      afternoon: "Matta Rice, Fish Curry (or Veg Curry), Beans Thoran",
      evening: "Tea & Uzhunnu Vada",
      night: "Chapathi & Chana Masala",
    },
    {
      day: "Friday",
      morning: "Upma & Banana",
      afternoon: "Matta Rice, Pulissery, Olan, Pappadam",
      evening: "Tea & Bonda",
      night: "Vegetable Fried Rice & Gobi Manchurian",
    },
    {
      day: "Saturday",
      morning: "Puttu & Green Peas Curry",
      afternoon: "Matta Rice, Sambar, Beetroot Thoran, Rasam",
      evening: "Tea & Samosa",
      night: "Egg Curry & Chapathi",
    },
    {
      day: "Sunday",
      morning: "Appam & Chicken Curry (or Veg Kurma)",
      afternoon: "Kerala Sadya Style Meals (Rice, Sambar, Avial, Kaalan, Thoran, Payasam)",
      evening: "Tea & Banana Chips",
      night: "Tomato Rice & Raita",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" />
          Weekly Mess Menu
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Morning</TableHead>
                <TableHead>Afternoon</TableHead>
                <TableHead>Evening (Tea)</TableHead>
                <TableHead>Night</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {menu.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-semibold">
                    {item.day}
                  </TableCell>
                  <TableCell>{item.morning}</TableCell>
                  <TableCell>{item.afternoon}</TableCell>
                  <TableCell>{item.evening}</TableCell>
                  <TableCell>{item.night}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          <p><strong>Food Timings:</strong></p>
          <p>🌅 Morning: 7:00 AM – 9:00 AM</p>
          <p>🍛 Afternoon: 12:30 PM – 2:00 PM</p>
          <p>☕ Evening Tea: 4:30 PM – 5:30 PM</p>
          <p>🌙 Night: 7:30 PM – 9:00 PM</p>
        </div>
      </CardContent>
    </Card>
  );
}
