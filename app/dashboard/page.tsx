"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTasks, fetchNotes, fetchImportantMessages } from "@/lib/api";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { 
  CalendarDays, 
  CheckCircle2, 
  ListTodo, 
  StickyNote, 
  AlertCircle, 
  Clock, 
  Timer,
  TrendingUp,
  Calendar,
  Target
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

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
  const [notes, setNotes] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [tasksByCategory, setTasksByCategory] = useState<any[]>([]);
  const [timeTracking, setTimeTracking] = useState({
    isRunning: false,
    time: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, notesData, messagesData] = await Promise.all([
          fetchTasks(),
          fetchNotes(),
          fetchImportantMessages(),
        ]);
        setTasks(tasksData);
        setNotes(notesData);
        setMessages(messagesData);

        const categories = tasksData.reduce((acc: any, task: any) => {
          const category = task.category || "Uncategorized";
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        setTasksByCategory(
          Object.entries(categories).map(([name, value]) => ({
            name,
            value,
          }))
        );
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
  }, []);

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const overdueTasksCount = tasks.filter(task => 
    !task.completed && new Date(`${task.deadline} ${task.time}`) < new Date()
  ).length;

  const pieData = [
    { name: "Completed", value: completedTasks },
    { name: "Pending", value: pendingTasks },
  ];

  const COLORS = ["#10B981", "#EF4444"];

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

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 space-y-6"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            {getGreeting()}, <span className="text-primary">Ish Kumar</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your tasks today
          </p>
        </div>
        <Button className="gap-2">
          <Calendar className="h-4 w-4" />
          {format(new Date(), "MMMM d, yyyy")}
        </Button>
      </motion.div>
      
      <motion.div variants={container} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div variants={item}>
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ListTodo className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tasks.length}</div>
              <Progress value={(completedTasks / tasks.length) * 100} className="h-1 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {completedTasks} completed, {pendingTasks} pending
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{overdueTasksCount}</div>
              <Progress value={(overdueTasksCount / tasks.length) * 100} className="h-1 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {((overdueTasksCount / tasks.length) * 100).toFixed(1)}% of total tasks
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productivity</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {((completedTasks / tasks.length) * 100).toFixed(1)}%
              </div>
              <Progress value={(completedTasks / tasks.length) * 100} className="h-1 mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Task completion rate
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Tracking</CardTitle>
              <Timer className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono">{formatTime(timeTracking.time)}</div>
              <div className="flex gap-2 mt-2">
                <Button 
                  size="sm" 
                  variant={timeTracking.isRunning ? "destructive" : "default"}
                  onClick={() => setTimeTracking(prev => ({ 
                    ...prev, 
                    isRunning: !prev.isRunning 
                  }))}
                  className="w-full"
                >
                  {timeTracking.isRunning ? "Stop" : "Start"}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setTimeTracking({ time: 0, isRunning: false })}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={container} className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div variants={item} className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Task Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tasksByCategory}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Completion Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#10B981] rounded-full mr-2" />
                    <span className="text-sm text-muted-foreground">Completed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-[#EF4444] rounded-full mr-2" />
                    <span className="text-sm text-muted-foreground">Pending</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Important Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks
                .filter(task => task.priority === "Urgent" && !task.completed)
                .slice(0, 5)
                .map((task, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{task.task}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <span>{task.deadline}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          <span>{task.time}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm">
                      Take Action
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}