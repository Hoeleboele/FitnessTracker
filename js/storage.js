/* storage.js — localStorage persistence layer for Iron Quest */
(function (global) {
  'use strict';

  const KEY = 'ironQuest.data.v1';

  const defaultData = {
    practices: [],   // { id, name, weight, reps }
    workouts: [],    // { id, name, rest, exercises: [{ practiceId, name, weight, reps }] }
    sessions: [],    // { id, workoutId, name, date, rest, results: [{ name, weight, reps }] }
    profile: { xp: 0 }
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return structuredClone(defaultData);
      const parsed = JSON.parse(raw);
      return Object.assign(structuredClone(defaultData), parsed);
    } catch (e) {
      console.error('Failed to load data, resetting.', e);
      return structuredClone(defaultData);
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  const Store = {
    data: load(),

    persist() { save(this.data); },

    // ---- Practices ----
    getPractices() { return this.data.practices; },
    getPractice(id) { return this.data.practices.find(p => p.id === id); },
    addPractice(p) {
      const practice = { id: uid(), name: p.name.trim(), weight: +p.weight, reps: +p.reps };
      this.data.practices.push(practice);
      this.persist();
      return practice;
    },
    updatePractice(id, changes) {
      const p = this.getPractice(id);
      if (!p) return;
      Object.assign(p, changes);
      this.persist();
    },
    deletePractice(id) {
      this.data.practices = this.data.practices.filter(p => p.id !== id);
      this.persist();
    },

    // ---- Workouts ----
    getWorkouts() { return this.data.workouts; },
    getWorkout(id) { return this.data.workouts.find(w => w.id === id); },
    addWorkout(w) {
      const workout = { id: uid(), name: w.name.trim(), rest: +w.rest, exercises: w.exercises };
      this.data.workouts.push(workout);
      this.persist();
      return workout;
    },
    updateWorkout(id, changes) {
      const w = this.getWorkout(id);
      if (!w) return;
      Object.assign(w, changes);
      this.persist();
    },
    deleteWorkout(id) {
      this.data.workouts = this.data.workouts.filter(w => w.id !== id);
      this.persist();
    },

    // ---- Sessions (history) ----
    getSessions() {
      return [...this.data.sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    addSession(s) {
      const session = {
        id: uid(),
        workoutId: s.workoutId,
        name: s.name,
        date: new Date().toISOString(),
        rest: +s.rest,
        results: s.results
      };
      this.data.sessions.push(session);
      this.persist();
      return session;
    },
    deleteSession(id) {
      this.data.sessions = this.data.sessions.filter(s => s.id !== id);
      this.persist();
    },
    // Most recent session before a given date for the same workout
    previousSession(workoutId, beforeDate) {
      return this.data.sessions
        .filter(s => s.workoutId === workoutId && new Date(s.date) < new Date(beforeDate))
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    },

    // ---- Profile / XP ----
    getProfile() { return this.data.profile; },
    addXp(amount) {
      this.data.profile.xp += amount;
      this.persist();
    }
  };

  global.Store = Store;
  global.QuestUid = uid;
})(window);
