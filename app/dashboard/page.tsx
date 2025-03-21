"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetchTasks, fetchNotes, fetchImportantMessages } from "@/lib/api";
import { 
  Bot,
  Brain,
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Timer,
  Calendar,
  Sparkles,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [timeTracking, setTimeTracking] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('timeTracking');
      return saved ? JSON.parse(saved) : { isRunning: false, time: 0 };
    }
    return { isRunning: false, time: 0 };
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, messagesData] = await Promise.all([
          fetchTasks(),
          fetchImportantMessages(),
        ]);
        setTasks(tasksData);
        setMessages(messagesData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeTracking.isRunning) {
      interval = setInterval(() => {
        setTimeTracking(prev => {
          const newState = {
            ...prev,
            time: prev.time + 1
          };
          localStorage.setItem('timeTracking', JSON.stringify(newState));
          return newState;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timeTracking.isRunning]);

  const completedTasks = tasks.filter(task => task.completed).length;
  const urgentTasks = tasks.filter(task => task.priority === "Urgent" && !task.completed);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'from-red-500 to-red-600';
      case 'high':
        return 'from-orange-500 to-orange-600';
      case 'medium':
        return 'from-yellow-500 to-yellow-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.deadline);
      return isSameDay(taskDate, date);
    });
  };

  const days = getDaysInMonth();

  return (
    <div className="min-h-screen bg-black">
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="p-6 space-y-8"
      >
        <motion.div variants={item} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center relative">
              <Bot className="h-8 w-8 text-primary" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </motion.div>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                {getGreeting()}, <span className="text-primary">Ish</span>
              </h1>
              <p className="text-gray-400 mt-1">
                I've analyzed your WhatsApp messages and organized your tasks
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={container} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={item}>
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Messages Analyzed</CardTitle>
                <Brain className="h-4 w-4 text-white/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{messages.length}</div>
                <Progress value={(messages.length / 100) * 100} className="h-1 mt-2 bg-white/20" />
                <p className="text-xs text-white/80 mt-2">
                  From your WhatsApp chats
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-pink-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Task Progress</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-white/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{completedTasks}/{tasks.length}</div>
                <Progress value={(completedTasks / tasks.length) * 100} className="h-1 mt-2 bg-white/20" />
                <p className="text-xs text-white/80 mt-2">
                  Tasks completed today
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Urgent Tasks</CardTitle>
                <AlertCircle className="h-4 w-4 text-white/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{urgentTasks.length}</div>
                <Progress value={(urgentTasks.length / tasks.length) * 100} className="h-1 mt-2 bg-white/20" />
                <p className="text-xs text-white/80 mt-2">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-none shadow-lg bg-gradient-to-br from-amber-500 to-orange-600">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Focus Timer</CardTitle>
                <Timer className="h-4 w-4 text-white/80" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono text-white">{formatTime(timeTracking.time)}</div>
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    variant={timeTracking.isRunning ? "destructive" : "secondary"}
                    onClick={() => setTimeTracking(prev => {
                      const newState = { ...prev, isRunning: !prev.isRunning };
                      localStorage.setItem('timeTracking', JSON.stringify(newState));
                      return newState;
                    })}
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-none"
                  >
                    {timeTracking.isRunning ? "Stop" : "Start"}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const newState = { time: 0, isRunning: false };
                      localStorage.setItem('timeTracking', JSON.stringify(newState));
                      setTimeTracking(newState);
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white border-none"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none shadow-lg bg-white/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-semibold text-white">Task Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                  className="text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-white font-medium">
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                  className="text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                    {day}
                  </div>
                ))}
                {days.map((day, index) => {
                  const dayTasks = getTasksForDate(day);
                  return (
                    <HoverCard key={day.toString()}>
                      <HoverCardTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`h-16 relative ${
                            isToday(day) ? 'bg-primary/20' : 
                            dayTasks.length > 0 ? 'bg-white/5' : ''
                          } hover:bg-white/10`}
                          onClick={() => {
                            if (dayTasks.length > 0) {
                              setSelectedTask(dayTasks[0]);
                            }
                          }}
                        >
                          <span className={`text-sm ${isToday(day) ? 'text-primary' : 'text-white'}`}>
                            {format(day, 'd')}
                          </span>
                          {dayTasks.length > 0 && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                              {dayTasks.slice(0, 3).map((_, i) => (
                                <div
                                  key={i}
                                  className="h-1.5 w-1.5 rounded-full bg-primary"
                                />
                              ))}
                            </div>
                          )}
                        </Button>
                      </HoverCardTrigger>
                      {dayTasks.length > 0 && (
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            {dayTasks.map((task, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full bg-${getPriorityColor(task.priority)}`} />
                                <span className="text-sm">{task.task}</span>
                              </div>
                            ))}
                          </div>
                        </HoverCardContent>
                      )}
                    </HoverCard>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
              <DialogDescription>
                <div className="space-y-4 mt-4">
                  <div>
                    <h3 className="font-medium">{selectedTask?.task}</h3>
                    <p className="text-sm text-muted-foreground">
                      From {selectedTask?.from || 'WhatsApp'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedTask?.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{selectedTask?.time}</span>
                    </div>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <motion.div variants={item}>
          <h2 className="text-xl font-semibold text-white mb-4">Priority Tasks</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {urgentTasks.map((task, index) => (
              <Card key={index} className={`border-none shadow-lg bg-gradient-to-br ${getPriorityColor(task.priority)}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{task.task}</h3>
                      <p className="text-sm text-white/80">From {task.from || 'WhatsApp'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{task.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{task.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item}>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Messages</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {messages.slice(0, 4).map((message, index) => (
              <Card key={index} className="border-none shadow-lg bg-white/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white truncate">{message.text}</h4>
                      <p className="text-sm text-gray-400 mt-1">
                        From {message.from || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
