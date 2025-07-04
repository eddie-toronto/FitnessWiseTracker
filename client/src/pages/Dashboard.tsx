import { useState, useEffect } from "react";
import { Dumbbell, List, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { UserStats } from "@/lib/types";

interface DashboardProps {
  onStartWorkout: (day: 'A' | 'B' | 'C') => void;
}

export function Dashboard({ onStartWorkout }: DashboardProps) {
  const { appUser } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalWorkouts: 0,
    pullUps: 0,
    avgDuration: "0m",
    thisWeek: 0,
    currentStreak: 0,
  });

  useEffect(() => {
    if (appUser) {
      setStats({
        totalWorkouts: appUser.totalWorkouts || 0,
        pullUps: 0, // TODO: Calculate from exercise data
        avgDuration: "0m", // TODO: Calculate from workout data
        thisWeek: 0, // TODO: Calculate from recent workouts
        currentStreak: appUser.currentStreak || 0,
      });
    }
  }, [appUser]);

  const statCards = [
    {
      value: stats.totalWorkouts,
      label: "TOTAL\nWORKOUTS",
      color: "border-blue-500",
      textColor: "text-blue-600",
    },
    {
      value: stats.pullUps,
      label: "PULL-UPS",
      color: "border-green-500",
      textColor: "text-green-600",
    },
    {
      value: stats.avgDuration,
      label: "AVG DURATION",
      color: "border-yellow-500",
      textColor: "text-yellow-600",
    },
    {
      value: stats.thisWeek,
      label: "THIS WEEK",
      color: "border-purple-500",
      textColor: "text-purple-600",
    },
  ];

  const recentWorkouts = [
    {
      name: "Day A - Vertical Pull",
      date: "2 days ago",
      duration: "42m",
      exercises: 8,
    },
    {
      name: "Day B - Horizontal Pull",
      date: "4 days ago",
      duration: "38m",
      exercises: 6,
    },
    {
      name: "Day C - Power & Mixed",
      date: "6 days ago",
      duration: "35m",
      exercises: 7,
    },
  ];

  const weeklyProgress = [
    { label: "Mon", progress: 60 },
    { label: "Tue", progress: 0 },
    { label: "Wed", progress: 80 },
    { label: "Thu", progress: 0 },
    { label: "Fri", progress: 90 },
    { label: "Sat", progress: 0 },
    { label: "Sun", progress: 70 },
  ];

  return (
    <div className="dashboard-view">
      <div className="max-w-7xl mx-auto p-4">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Ready to Build Your V-Back? 💪
          </h2>
          <p className="text-gray-600">
            Track your workouts with precision and watch your progress soar
          </p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className={`shadow-sm border-l-4 ${stat.color}`}>
              <CardContent className="p-6">
                <div className={`text-3xl font-bold mb-2 ${stat.textColor}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 font-medium whitespace-pre-line">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button
            onClick={() => onStartWorkout('A')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg min-h-[44px] shadow-lg"
          >
            <Dumbbell className="h-5 w-5 mr-2" />
            Start Today's Workout
          </Button>
          
          <Button
            variant="outline"
            className="border-gray-600 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg min-h-[44px] shadow-lg"
          >
            <List className="h-5 w-5 mr-2" />
            View Workouts
          </Button>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-sm mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentWorkouts.map((workout, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Dumbbell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{workout.name}</div>
                      <div className="text-sm text-gray-500">{workout.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">{workout.duration}</div>
                    <div className="text-sm text-green-600">{workout.exercises} exercises</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress Chart */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Progress</h3>
            <div className="grid grid-cols-7 gap-2">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="text-center">
                  <div className="text-xs text-gray-500 mb-2">{day.label}</div>
                  <div className="w-8 h-16 bg-gray-100 rounded-lg mx-auto relative">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-lg transition-all duration-300"
                      style={{ height: `${day.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
