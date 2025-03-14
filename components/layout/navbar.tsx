"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { UserNav } from "@/components/user-nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  return (
    <div className="border-b bg-white dark:bg-gray-900">
      <div className="flex h-16 items-center px-6">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks, notes, or messages..." 
              className="pl-10 bg-secondary"
            />
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Quick Add
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-auto">
                <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                  <div className="font-medium">New task assigned</div>
                  <div className="text-sm text-muted-foreground">
                    John Doe assigned you a new task: "Review project proposal"
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </div>
  );
}