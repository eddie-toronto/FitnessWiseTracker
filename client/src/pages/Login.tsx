import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Chrome } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Login() {
  const { login, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Welcome to FitnessWise</CardTitle>
          <p className="text-gray-600 mt-2">
            Track your back workouts with precision and watch your progress soar
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button
            onClick={login}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white min-h-[44px] text-lg"
          >
            <Chrome className="h-5 w-5 mr-2" />
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>
          
          <div className="text-center text-sm text-gray-500">
            <p>
              Secure authentication powered by Google
            </p>
            <p className="mt-2">
              Your workout data is automatically synced across all your devices
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
