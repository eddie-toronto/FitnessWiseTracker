/**
 * Workout Data - Three-day back workout program
 * Day A: Vertical Pull Focus (V-taper development)
 * Day B: Horizontal Pull & Barbell (thickness)
 * Day C: Power & Mixed Patterns (explosive strength)
 */

export const WORKOUT_DATA = {
  dayA: {
    title: "Vertical Pull Focus",
    focus: "Building pull-up strength and lat development for that coveted V-taper",
    exercises: [
      {
        name: "Pull-ups",
        description: "Vertical pulling movement for lat development. Focus on full range of motion and controlled tempo.",
        sets: [
          { targetReps: 8, completedReps: 0, completed: false },
          { targetReps: 6, completedReps: 0, completed: false },
          { targetReps: 4, completedReps: 0, completed: false }
        ],
        videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
        equipment: "pull-up bar",
        muscleGroups: ["lats", "rhomboids", "middle traps", "biceps"]
      },
      {
        name: "Lat Pulldowns",
        description: "Machine-based vertical pull. Use wide grip and focus on pulling elbows down and back.",
        sets: [
          { targetReps: 10, completedReps: 0, completed: false },
          { targetReps: 8, completedReps: 0, completed: false },
          { targetReps: 6, completedReps: 0, completed: false }
        ],
        videoUrl: "https://www.youtube.com/watch?v=CAwf7n6Luuc",
        equipment: "cable machine",
        muscleGroups: ["lats", "rear delts", "biceps"]
      },
      {
        name: "Cable Rows",
        description: "Horizontal pulling for thickness. Keep chest up and squeeze shoulder blades together.",
        sets: [
          { targetReps: 12, completedReps: 0, completed: false },
          { targetReps: 10, completedReps: 0, completed: false },
          { targetReps: 8, completedReps: 0, completed: false }
        ],
        videoUrl: "https://www.youtube.com/watch?v=GZbfZ033f74",
        equipment: "cable machine",
        muscleGroups: ["rhomboids", "middle traps", "rear delts", "biceps"]
      },
      {
        name: "Straight-Arm Pulldowns",
        description: "Isolation movement for lats. Keep arms straight and focus on lat engagement.",
        sets: [
          { targetReps: 15, completedReps: 0, completed: false },
          { targetReps: 12, completedReps: 0, completed: false },
          { targetReps: 10, completedReps: 0, completed: false }
        ],
        videoUrl: "https://www.youtube.com/watch?v=kjR8Dx6R2tc",
        equipment: "cable machine",
        muscleGroups: ["lats", "rear delts"]
      }
    ]
  },
  
  dayB: {
    title: "Horizontal Pull & Barbell",
    focus: "Building back thickness and strength with horizontal movements",
    exercises: [
      {
        name: "Barbell Rows",
        description: "Compound horizontal pulling movement. Maintain neutral spine and pull bar to lower chest.",
        sets: [
          { targetReps: 8, completedReps: 0, completed: false },
          { targetReps: 6, completedReps: 0, completed: false },
          { targetReps: 5, completedReps: 0, completed: false }
        ],
        videoUrl: "https://www.youtube.com/watch?v=9efgcAjQe7E",
        equipment: "barbell",
        muscleGroups: ["rhomboids", "middle traps", "lats", "rear delts"]
      },
      {
        name: "T-Bar Rows",
        description: "Heavy horizontal pulling with neutral grip. Focus on driving elbows back.",
        sets: [
          { targetReps: 10, completedReps: 0, completed: false },
          { targetReps: 8, completedReps: 0, completed: false },
          { targetReps: 6, completedReps: 0, completed: false }
        ],
        videoUrl: "https://www.youtube.com/watch?v=j3Igk5nyZE4",
        equipment: "T-bar row machine",
        muscleGroups: ["rhomboids", "middle traps", "lats"]
      },
      {
        name: "Dumbbell Rows",
        description: "Unilateral horizontal pulling. Focus on full range of motion and controlled tempo.",
        sets: [
          { targetReps: 12, completedReps: 0, completed: false },
          { targetReps: 10, completedReps: 0, completed: false },
          { targetReps: 8, completedReps: 0, completed: false }
        ],
        videoUrl: "https://www.youtube.com/watch?v=roCP6wCXPqo",
        equipment: "dumbbells",
        muscleGroups: ["lats", "rhomboids", "rear delts", "biceps"]
      },
      {
        name: "Face Pulls",
        description: "High-rep posterior delt and rhomboid exercise. Pull to face level with external rotation.",
        sets: [
          { targetReps: 20, completedReps: 0, completed: false },
          { targetReps: 15, completedReps: 0, completed: false },
          { targetReps: 12, completedReps: 0, completed: false }
        ],
        videoUrl: "https://www.youtube.com/watch?v=rep-qVOkqgk",
        equipment: "cable machine",
        muscleGroups: ["rear delts", "rhomboids", "external rotators"]
      }
    ]
  },
  
  dayC: {
    title: "Power & Mixed Patterns",
    focus: "Explosive strength and varied movement patterns for complete back development",
    exercises: [
      {
        name: "Deadlifts",
        description: "King of back exercises. Focus on hip hinge pattern and maintaining neutral spine.",
        sets: [
          { targetReps: 5, completedReps: 0, completed: false },
          { targetReps: 3, completedReps: 0, completed: false },
          { targetReps: 2, completedReps: 0, completed: false }
        ],
        videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
        equipment: "barbell",
        muscleGroups: ["erector spinae", "lats", "traps", "rhomboids"]
      },
      {
        name: "Rack Pulls",
        description: "Partial deadlift from elevated position. Focus on lockout strength and trap development.",
        sets: [
          { targetReps: 6, completedReps: 0, completed: false },
          { targetReps: 4, completedReps: 0, completed: false },
          { targetReps: 3, completedReps: 0, completed: false }
        ],
        videoUrl: "https://www.youtube.com/watch?v=ZWi2ZcXMMJ4",
        equipment: "barbell, power rack",
        muscleGroups: ["upper traps", "erector spinae", "lats"]
      },
      {
        name: "Chin-ups",
        description: "Underhand grip pull-up variation. More bicep involvement and slightly different lat activation.",
        sets: [
          { targetReps: 8, completedReps: 0, completed: false },
          { targetReps: 6, completedReps: 0, completed: false },
          { targetReps: 4, completedReps: 0, completed: false }
        ],
        videoUrl: "https://www.youtube.com/watch?v=brhRXlOhkAM",
        equipment: "pull-up bar",
        muscleGroups: ["lats", "biceps", "rhomboids"]
      },
      {
        name: "Renegade Rows",
        description: "Dynamic core and back exercise. Maintain plank position while rowing.",
        sets: [
          { targetReps: 10, completedReps: 0, completed: false },
          { targetReps: 8, completedReps: 0, completed: false },
          { targetReps: 6, completedReps: 0, completed: false }
        ],
        videoUrl: "https://www.youtube.com/watch?v=KjzScCM_-h8",
        equipment: "dumbbells",
        muscleGroups: ["lats", "rhomboids", "core", "shoulders"]
      },
      {
        name: "Band Pull-Aparts",
        description: "High-rep rear delt and rhomboid exercise. Focus on squeezing shoulder blades together.",
        sets: [
          { targetReps: 25, completedReps: 0, completed: false },
          { targetReps: 20, completedReps: 0, completed: false },
          { targetReps: 15, completedReps: 0, completed: false }
        ],
        videoUrl: "https://www.youtube.com/watch?v=phCDeJSjzj8",
        equipment: "resistance band",
        muscleGroups: ["rear delts", "rhomboids", "middle traps"]
      }
    ]
  }
};

export default WORKOUT_DATA;