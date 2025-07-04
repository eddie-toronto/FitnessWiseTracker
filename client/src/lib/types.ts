export interface WorkoutData {
  dayA: WorkoutDay;
  dayB: WorkoutDay;
  dayC: WorkoutDay;
}

export interface WorkoutDay {
  title: string;
  focus: string;
  exercises: ExerciseData[];
}

export interface ExerciseData {
  name: string;
  description: string;
  sets: ExerciseSet[];
  videoUrl?: string;
  equipment: string;
  muscleGroups: string[];
}

export interface ExerciseSet {
  targetReps: number;
  completedReps: number;
  completed: boolean;
  weight?: number;
}

export interface TimerState {
  running: boolean;
  elapsed: number;
  startTime?: number;
}

export interface WorkoutSession {
  currentWorkout: 'A' | 'B' | 'C';
  currentExercise: number;
  timerState: TimerState;
  exercises: ExerciseData[];
  userId?: number;
}

export interface UserStats {
  totalWorkouts: number;
  pullUps: number;
  avgDuration: string;
  thisWeek: number;
  currentStreak: number;
}

export const DEFAULT_WORKOUT_DATA: WorkoutData = {
  dayA: {
    title: "Vertical Pull Focus",
    focus: "Building pull-up strength and lat development",
    exercises: [
      {
        name: "Pull-ups",
        description: "Vertical pulling movement for lat development",
        sets: [
          { targetReps: 8, completedReps: 0, completed: false },
          { targetReps: 6, completedReps: 0, completed: false },
          { targetReps: 4, completedReps: 0, completed: false }
        ],
        videoUrl: "https://youtube.com/watch?v=example1",
        equipment: "pull-up bar",
        muscleGroups: ["lats", "rhomboids", "middle traps"]
      },
      {
        name: "Lat Pulldowns",
        description: "Machine-based vertical pull",
        sets: [
          { targetReps: 10, completedReps: 0, completed: false },
          { targetReps: 8, completedReps: 0, completed: false },
          { targetReps: 6, completedReps: 0, completed: false }
        ],
        videoUrl: "https://youtube.com/watch?v=example2",
        equipment: "cable machine",
        muscleGroups: ["lats", "rear delts"]
      },
      {
        name: "Cable Rows",
        description: "Horizontal pulling for thickness",
        sets: [
          { targetReps: 12, completedReps: 0, completed: false },
          { targetReps: 10, completedReps: 0, completed: false },
          { targetReps: 8, completedReps: 0, completed: false }
        ],
        videoUrl: "https://youtube.com/watch?v=example3",
        equipment: "cable machine",
        muscleGroups: ["rhomboids", "middle traps", "rear delts"]
      }
    ]
  },
  dayB: {
    title: "Horizontal Pull & Barbell",
    focus: "Building back thickness and strength",
    exercises: [
      {
        name: "Barbell Rows",
        description: "Compound horizontal pulling movement",
        sets: [
          { targetReps: 8, completedReps: 0, completed: false },
          { targetReps: 6, completedReps: 0, completed: false },
          { targetReps: 4, completedReps: 0, completed: false }
        ],
        videoUrl: "https://youtube.com/watch?v=example4",
        equipment: "barbell",
        muscleGroups: ["rhomboids", "middle traps", "lats"]
      },
      {
        name: "T-Bar Rows",
        description: "Thick back development",
        sets: [
          { targetReps: 10, completedReps: 0, completed: false },
          { targetReps: 8, completedReps: 0, completed: false },
          { targetReps: 6, completedReps: 0, completed: false }
        ],
        videoUrl: "https://youtube.com/watch?v=example5",
        equipment: "t-bar",
        muscleGroups: ["rhomboids", "middle traps"]
      }
    ]
  },
  dayC: {
    title: "Power & Mixed Patterns",
    focus: "Explosive strength and varied movement patterns",
    exercises: [
      {
        name: "Chin-ups",
        description: "Underhand grip variation",
        sets: [
          { targetReps: 6, completedReps: 0, completed: false },
          { targetReps: 5, completedReps: 0, completed: false },
          { targetReps: 4, completedReps: 0, completed: false }
        ],
        videoUrl: "https://youtube.com/watch?v=example6",
        equipment: "pull-up bar",
        muscleGroups: ["lats", "biceps"]
      },
      {
        name: "Face Pulls",
        description: "Rear delt and upper back",
        sets: [
          { targetReps: 15, completedReps: 0, completed: false },
          { targetReps: 12, completedReps: 0, completed: false },
          { targetReps: 10, completedReps: 0, completed: false }
        ],
        videoUrl: "https://youtube.com/watch?v=example7",
        equipment: "cable machine",
        muscleGroups: ["rear delts", "upper traps"]
      }
    ]
  }
};
