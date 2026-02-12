'use client';

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Bell } from "lucide-react";

type Notice = {
  id: number;
  title: string;
  content: string;
  summary: string;
  date: string;
};

const API_URL = "http://localhost:5000";

export default function StudentNoticesPage() {

  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/student/notices`)
      .then(res => res.json())
      .then(data => setNotices(data))
      .catch(err => console.error("Error fetching notices:", err));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notice Board
        </CardTitle>
        <CardDescription>
          Important announcements and updates from the administration.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Accordion type="single" collapsible className="w-full">

          {notices.length > 0 ? (
            notices.map((notice) => (
              <AccordionItem
                key={notice.id}
                value={notice.id.toString()}
              >
                <AccordionTrigger>
                  <div className="flex justify-between w-full pr-4 items-center">
                    <span className="text-left font-semibold">
                      {notice.title}
                    </span>
                    <span className="text-sm text-muted-foreground ml-4">
                      {notice.date}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="space-y-4 pt-2">
                  <p className="text-base whitespace-pre-wrap leading-relaxed">
                    {notice.content}
                  </p>

                  {notice.summary && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">
                        AI Summary
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {notice.summary}
                      </p>
                    </div>
                  )}
                </AccordionContent>

              </AccordionItem>
            ))
          ) : (
            <p className="text-muted-foreground text-center p-4">
              No notices to display.
            </p>
          )}

        </Accordion>
      </CardContent>
    </Card>
  );
}
