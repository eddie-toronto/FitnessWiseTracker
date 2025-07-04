import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  username: text("username").notNull(),
  currentStreak: integer("current_streak").default(0),
  totalWorkouts: integer("total_workouts").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workouts = pgTable("workouts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  workoutDay: text("workout_day").notNull(), // 'A', 'B', or 'C'
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  completed: boolean("completed").default(false),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  workoutId: integer("workout_id").references(() => workouts.id),
  name: text("name").notNull(),
  sets: json("sets").$type<Array<{
    targetReps: number;
    completedReps: number;
    completed: boolean;
    weight?: number;
  }>>(),
  completed: boolean("completed").default(false),
  order: integer("order").notNull(),
});

export const workoutSessions = pgTable("workout_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionData: json("session_data").$type<{
    currentWorkout: string;
    currentExercise: number;
    timerState: {
      running: boolean;
      elapsed: number;
      startTime?: number;
    };
    exercises: Array<{
      name: string;
      sets: Array<{
        targetReps: number;
        completedReps: number;
        completed: boolean;
        weight?: number;
      }>;
      completed: boolean;
    }>;
  }>(),
  lastSaved: timestamp("last_saved").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
});

export const insertWorkoutSessionSchema = createInsertSchema(workoutSessions).omit({
  id: true,
  lastSaved: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type InsertWorkoutSession = z.infer<typeof insertWorkoutSessionSchema>;
