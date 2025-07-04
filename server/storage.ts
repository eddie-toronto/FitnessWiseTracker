import { users, workouts, exercises, workoutSessions, type User, type InsertUser, type Workout, type InsertWorkout, type Exercise, type InsertExercise, type WorkoutSession, type InsertWorkoutSession } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;

  // Workout operations
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  getWorkout(id: number): Promise<Workout | undefined>;
  getUserWorkouts(userId: number): Promise<Workout[]>;
  updateWorkout(id: number, updates: Partial<Workout>): Promise<Workout>;
  
  // Exercise operations
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  getWorkoutExercises(workoutId: number): Promise<Exercise[]>;
  updateExercise(id: number, updates: Partial<Exercise>): Promise<Exercise>;
  
  // Session operations
  saveWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession>;
  getWorkoutSession(userId: number): Promise<WorkoutSession | undefined>;
  deleteWorkoutSession(userId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private workouts: Map<number, Workout> = new Map();
  private exercises: Map<number, Exercise> = new Map();
  private workoutSessions: Map<number, WorkoutSession> = new Map();
  private currentUserId = 1;
  private currentWorkoutId = 1;
  private currentExerciseId = 1;
  private currentSessionId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createWorkout(insertWorkout: InsertWorkout): Promise<Workout> {
    const workout: Workout = {
      ...insertWorkout,
      id: this.currentWorkoutId++,
      createdAt: new Date(),
    };
    this.workouts.set(workout.id, workout);
    return workout;
  }

  async getWorkout(id: number): Promise<Workout | undefined> {
    return this.workouts.get(id);
  }

  async getUserWorkouts(userId: number): Promise<Workout[]> {
    return Array.from(this.workouts.values()).filter(
      (workout) => workout.userId === userId
    );
  }

  async updateWorkout(id: number, updates: Partial<Workout>): Promise<Workout> {
    const workout = this.workouts.get(id);
    if (!workout) throw new Error('Workout not found');
    
    const updatedWorkout = { ...workout, ...updates };
    this.workouts.set(id, updatedWorkout);
    return updatedWorkout;
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const exercise: Exercise = {
      ...insertExercise,
      id: this.currentExerciseId++,
    };
    this.exercises.set(exercise.id, exercise);
    return exercise;
  }

  async getWorkoutExercises(workoutId: number): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(
      (exercise) => exercise.workoutId === workoutId
    );
  }

  async updateExercise(id: number, updates: Partial<Exercise>): Promise<Exercise> {
    const exercise = this.exercises.get(id);
    if (!exercise) throw new Error('Exercise not found');
    
    const updatedExercise = { ...exercise, ...updates };
    this.exercises.set(id, updatedExercise);
    return updatedExercise;
  }

  async saveWorkoutSession(insertSession: InsertWorkoutSession): Promise<WorkoutSession> {
    const existingSession = Array.from(this.workoutSessions.values()).find(
      (session) => session.userId === insertSession.userId
    );

    if (existingSession) {
      const updatedSession: WorkoutSession = {
        ...existingSession,
        sessionData: insertSession.sessionData,
        lastSaved: new Date(),
      };
      this.workoutSessions.set(existingSession.id, updatedSession);
      return updatedSession;
    }

    const session: WorkoutSession = {
      ...insertSession,
      id: this.currentSessionId++,
      lastSaved: new Date(),
    };
    this.workoutSessions.set(session.id, session);
    return session;
  }

  async getWorkoutSession(userId: number): Promise<WorkoutSession | undefined> {
    return Array.from(this.workoutSessions.values()).find(
      (session) => session.userId === userId
    );
  }

  async deleteWorkoutSession(userId: number): Promise<void> {
    const session = Array.from(this.workoutSessions.values()).find(
      (session) => session.userId === userId
    );
    if (session) {
      this.workoutSessions.delete(session.id);
    }
  }
}

export const storage = new MemStorage();
