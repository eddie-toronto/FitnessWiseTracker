import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface SaveStatusIndicatorProps {
  status: string;
}

export function SaveStatusIndicator({ status }: SaveStatusIndicatorProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status !== "Ready") {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!visible) return null;

  const getStatusColor = () => {
    switch (status) {
      case "Saving...":
        return "bg-yellow-100 text-yellow-800";
      case "Saved":
        return "bg-green-100 text-green-800";
      case "Error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 p-3 shadow-lg border z-50">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${
          status === "Saving..." ? "bg-yellow-500 animate-pulse" : 
          status === "Saved" ? "bg-green-500" : 
          status === "Error" ? "bg-red-500" : 
          "bg-blue-500"
        }`} />
        <span className={`text-sm font-medium ${getStatusColor()}`}>
          {status}
        </span>
      </div>
    </Card>
  );
}
