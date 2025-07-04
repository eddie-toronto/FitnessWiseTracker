import { Home, Dumbbell, Settings, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "wouter";

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWorkout: (day: 'A' | 'B' | 'C') => void;
}

export function NavigationSidebar({ isOpen, onClose, onStartWorkout }: NavigationSidebarProps) {
  const [location] = useLocation();

  const navigationItems = [
    { href: "/", icon: Home, label: "Home", active: location === "/" },
    { href: "/settings", icon: Settings, label: "Settings", active: location === "/settings" },
    { href: "/feedback", icon: MessageCircle, label: "Feedback", active: location === "/feedback" },
  ];

  const workoutItems = [
    { 
      day: 'A' as const, 
      label: "Day A - Vertical Pull", 
      color: "text-yellow-500",
      icon: "💪"
    },
    { 
      day: 'B' as const, 
      label: "Day B - Horizontal Pull", 
      color: "text-orange-500",
      icon: "🔥"
    },
    { 
      day: 'C' as const, 
      label: "Day C - Power & Mixed", 
      color: "text-red-500",
      icon: "⚡"
    },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <nav className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="pt-20 p-6">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">WORKOUTS</h2>
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start h-12 ${
                      item.active 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'hover:bg-blue-50'
                    }`}
                    onClick={onClose}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">TRAINING DAYS</h2>
            <div className="space-y-2">
              {workoutItems.map((item) => (
                <Button
                  key={item.day}
                  variant="ghost"
                  className="w-full justify-start h-12 hover:bg-blue-50"
                  onClick={() => {
                    onStartWorkout(item.day);
                    onClose();
                  }}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">TOOLS</h2>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start h-12 hover:bg-blue-50"
              >
                <Settings className="h-5 w-5 mr-3 text-purple-600" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start h-12 hover:bg-blue-50"
              >
                <MessageCircle className="h-5 w-5 mr-3 text-purple-600" />
                Feedback
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
