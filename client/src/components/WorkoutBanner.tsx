import { ChevronLeft, ChevronRight, Plus, Minus, PlayCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExerciseData } from "@/lib/types";

interface WorkoutBannerProps {
  exercises: ExerciseData[];
  currentExercise: number;
  onUpdateSet: (exerciseIndex: number, setIndex: number, completedReps: number) => void;
  onCompleteSet: (exerciseIndex: number, setIndex: number) => void;
  onNextExercise: () => void;
  onPreviousExercise: () => void;
}

export function WorkoutBanner({
  exercises,
  currentExercise,
  onUpdateSet,
  onCompleteSet,
  onNextExercise,
  onPreviousExercise,
}: WorkoutBannerProps) {
  const exercise = exercises[currentExercise];

  if (!exercise) return null;

  const incrementReps = (setIndex: number) => {
    const currentReps = exercise.sets[setIndex].completedReps;
    onUpdateSet(currentExercise, setIndex, currentReps + 1);
  };

  const decrementReps = (setIndex: number) => {
    const currentReps = exercise.sets[setIndex].completedReps;
    onUpdateSet(currentExercise, setIndex, Math.max(0, currentReps - 1));
  };

  return (
    <div className="workout-banner p-4">
      <div className="max-w-7xl mx-auto">
        {/* Current Exercise */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{exercise.name}</h3>
              {exercise.videoUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-blue-600 hover:text-blue-700 min-h-[44px] min-w-[44px]"
                  onClick={() => window.open(exercise.videoUrl, '_blank')}
                >
                  <PlayCircle className="h-6 w-6" />
                </Button>
              )}
            </div>
            
            <p className="text-gray-600 mb-6">{exercise.description}</p>

            {/* Set Tracking */}
            <div className="space-y-4">
              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="text-lg font-bold text-gray-800">Set {setIndex + 1}</div>
                    <div className="text-gray-600">Target: {set.targetReps} reps</div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => decrementReps(setIndex)}
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-gray-300 hover:bg-gray-400 border-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <div className="text-2xl font-bold text-gray-800 min-w-[3rem] text-center">
                      {set.completedReps}
                    </div>
                    
                    <Button
                      onClick={() => incrementReps(setIndex)}
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white border-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      onClick={() => onCompleteSet(currentExercise, setIndex)}
                      className={`min-h-[44px] ${
                        set.completed 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {set.completed ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Completed
                        </>
                      ) : (
                        'Complete Set'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Exercise Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                onClick={onPreviousExercise}
                disabled={currentExercise === 0}
                className="bg-gray-600 hover:bg-gray-700 text-white min-h-[44px]"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={onNextExercise}
                disabled={currentExercise === exercises.length - 1}
                className="bg-blue-600 hover:bg-blue-700 text-white min-h-[44px]"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Exercise List */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Exercises</h3>
            <div className="space-y-3">
              {exercises.map((ex, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index === currentExercise ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{ex.name}</div>
                      <div className="text-sm text-gray-500">
                        {ex.sets.length} sets × {ex.sets.map(s => s.targetReps).join(',')} reps
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {ex.sets.every(set => set.completed) && (
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
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
