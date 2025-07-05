import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertWorkoutSchema, insertExerciseSchema, insertWorkoutSessionSchema } from "@shared/schema";
import { z } from "zod";
import express from "express";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/users/firebase/:firebaseUid", async (req, res) => {
    try {
      const user = await storage.getUserByFirebaseUid(req.params.firebaseUid);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const user = await storage.updateUser(id, updates);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Workout routes
  app.post("/api/workouts", async (req, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout(workoutData);
      res.json(workout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/workouts/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const workouts = await storage.getUserWorkouts(userId);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/workouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const workout = await storage.updateWorkout(id, updates);
      res.json(workout);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Exercise routes
  app.post("/api/exercises", async (req, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.json(exercise);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/exercises/workout/:workoutId", async (req, res) => {
    try {
      const workoutId = parseInt(req.params.workoutId);
      const exercises = await storage.getWorkoutExercises(workoutId);
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/exercises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const exercise = await storage.updateExercise(id, updates);
      res.json(exercise);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Session routes
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertWorkoutSessionSchema.parse(req.body);
      const session = await storage.saveWorkoutSession(sessionData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/sessions/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const session = await storage.getWorkoutSession(userId);
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/sessions/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.deleteWorkoutSession(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Serve vanilla JavaScript build at /vanilla route
  app.use('/vanilla', express.static(path.join(process.cwd(), 'vanilla-js')));
  
  // Redirect /vanilla to serve index.html
  app.get('/vanilla', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'vanilla-js', 'index.html'));
  });

  const httpServer = createServer(app);
  return httpServer;
}
