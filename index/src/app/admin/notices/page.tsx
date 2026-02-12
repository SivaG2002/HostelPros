'use client';

import { useEffect, useState } from "react";
import { NoticeForm } from "@/components/admin/notice-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const API_URL = "http://localhost:5000";

type Notice = {
  id: number;
  title: string;
  content: string;
  summary: string;
  created_at: string;
};

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);

  const fetchNotices = async () => {
    const res = await fetch(`${API_URL}/api/admin/notices`);
    const data = await res.json();
    setNotices(data);
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Create New Notice</CardTitle>
            <CardDescription>
              Post an announcement for all students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NoticeForm onSuccess={fetchNotices} />
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Posted Notices</CardTitle>
            <CardDescription>
              All previously posted notices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {notices.map((notice) => (
                <AccordionItem key={notice.id} value={notice.id.toString()}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4">
                      <span>{notice.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(notice.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="space-y-3">
                    <p>{notice.content}</p>

                    {notice.summary && (
                      <div>
                        <h4 className="font-semibold text-sm mb-1">
                          Summary
                        </h4>
                        <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                          {notice.summary}
                        </p>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}

              {notices.length === 0 && (
                <p className="text-center text-muted-foreground p-4">
                  No notices posted yet.
                </p>
              )}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
