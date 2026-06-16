"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Play, Check, X, Dumbbell, Search, Save } from "lucide-react";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  mainMuscleGroup: string;
}

interface DayExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  sets: number | null;
  reps: number | null;
  order: number;
}

interface RoutineDay {
  id: string;
  name: string;
  exercises: DayExercise[];
}

interface ActiveRoutine {
  routine: any;
  version: any;
  day: RoutineDay | null;
}

interface SessionExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  rir: number | null;
}

export default function WorkoutPage() {
  const router = useRouter();
  const [data, setData] = useState<ActiveRoutine | null>(null);
  const [loading, setLoading] = useState(true);
  const [exercises, setExercises] = useState<SessionExercise[]>([]);
  const [saving, setSaving] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/sessions/today").then((r) => r.json()),
      fetch("/api/exercises").then((r) => r.json()),
    ]).then(([sessionData, exercisesData]) => {
      setData(sessionData);
      setAvailableExercises(exercisesData);

      if (sessionData.day?.exercises) {
        setExercises(
          sessionData.day.exercises.map((ex: DayExercise) => ({
            exerciseId: ex.exerciseId,
            exerciseName: ex.exercise.name,
            sets: ex.sets || 4,
            reps: ex.reps || 10,
            weight: 0,
            rir: null,
          }))
        );
      }
      setLoading(false);
    });
  }, []);

  const updateExercise = useCallback((index: number, field: string, value: any) => {
    setExercises((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const removeExercise = useCallback((index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addExercise = useCallback(
    (exerciseId: string) => {
      const ex = availableExercises.find((e) => e.id === exerciseId);
      if (!ex) return;
      setExercises((prev) => [
        ...prev,
        { exerciseId, exerciseName: ex.name, sets: 4, reps: 10, weight: 0, rir: null },
      ]);
      setShowAddDialog(false);
      setExerciseSearch("");
    },
    [availableExercises]
  );

  const saveSession = async () => {
    if (exercises.length === 0) {
      toast.error("Agrega al menos un ejercicio");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString(),
          routineId: data?.routine?.id || null,
          routineVersionId: data?.version?.id || null,
          notes,
          exercises: exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            rir: ex.rir,
          })),
        }),
      });

      if (!res.ok) throw new Error("Error al guardar");
      toast.success("Entrenamiento guardado");
      setExercises([]);
      setNotes("");
      router.push("/");
    } catch {
      toast.error("Error al guardar el entrenamiento");
    } finally {
      setSaving(false);
    }
  };

  const filteredExercises = availableExercises.filter((e) =>
    e.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Entrenar Hoy</h1>
          <p className="text-sm text-muted-foreground">
            {data?.day?.name || data?.routine?.name || "Sin rutina activa"}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Ejercicio</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar ejercicio..."
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredExercises.map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => addExercise(ex.id)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-accent text-sm"
                    >
                      {ex.name}
                    </button>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={saveSession} disabled={saving}>
            <Save className="h-4 w-4 mr-1" />
            {saving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>

      {!data?.routine ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No hay rutina activa</p>
            <p className="text-sm text-muted-foreground mb-4">
              Crea o activa una rutina en la sección de Rutinas
            </p>
            <Button onClick={() => router.push("/routines")}>Ir a Rutinas</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {exercises.map((ex, idx) => (
            <Card key={idx}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{ex.exerciseName}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeExercise(idx)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Series</Label>
                    <Input
                      type="number"
                      value={ex.sets}
                      onChange={(e) => updateExercise(idx, "sets", parseInt(e.target.value) || 0)}
                      className="h-8 text-center"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Reps</Label>
                    <Input
                      type="number"
                      value={ex.reps}
                      onChange={(e) => updateExercise(idx, "reps", parseInt(e.target.value) || 0)}
                      className="h-8 text-center"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Peso (kg)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={ex.weight}
                      onChange={(e) => updateExercise(idx, "weight", parseFloat(e.target.value) || 0)}
                      className="h-8 text-center"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">RIR</Label>
                    <Select
                      value={ex.rir?.toString() || "0"}
                      onValueChange={(v) => updateExercise(idx, "rir", parseInt(v))}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4].map((n) => (
                          <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
