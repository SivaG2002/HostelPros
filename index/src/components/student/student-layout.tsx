'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset
} from '@/components/ui/sidebar';

import { Bell, BookOpenCheck, LayoutDashboard, ListTodo, Utensils, Wallet } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const navItems = [
  { href: '/student/rules', icon: BookOpenCheck, label: 'Rules' } ,
  { href: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/student/fees', icon: Wallet, label: 'My Fees' },
  { href: '/student/mess', icon: Utensils, label: 'Mess' },
  { href: '/student/complaints', icon: ListTodo, label: 'Complaints' },
  { href: '/student/notices', icon: Bell, label: 'Notices' },
 
];

export function StudentLayoutContent({
  children,
  userNav,
}: {
  children: React.ReactNode;
  userNav: React.ReactNode;
}) {
  const pathname = usePathname();

  const currentLabel =
    navItems.find(
      (item) =>
        pathname === item.href ||
        (item.href !== '/student/dashboard' &&
          pathname.startsWith(item.href))
    )?.label || 'Student Portal';

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-0">
          <div className="flex items-center gap-2 justify-center p-2 h-14 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:h-14">
            <BookOpenCheck className="size-7 text-primary flex-shrink-0" />
            <span className="text-xl font-semibold font-headline group-data-[collapsible=icon]:hidden">
              CampusConnect
            </span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  isActive={
                    pathname === item.href ||
                    (item.href !== '/student/dashboard' &&
                      pathname.startsWith(item.href))
                  }
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 sm:px-6 sticky top-0 z-30">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-lg font-semibold font-headline">
              {currentLabel}
            </h1>
          </div>
          {userNav}
        </header>

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
