"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft, Save, Search } from "lucide-react";
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
  order: number;
  exercises: DayExercise[];
}

interface RoutineVersion {
  id: string;
  version: number;
  days: RoutineDay[];
}

interface Routine {
  id: string;
  name: string;
  isActive: boolean;
  versions: RoutineVersion[];
}

export default function RoutineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [days, setDays] = useState<RoutineDay[]>([]);
  const [currentVersionIdx, setCurrentVersionIdx] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseSearch, setExerciseSearch] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/routines/${params.id}`).then((r) => r.json()),
      fetch("/api/exercises").then((r) => r.json()),
    ]).then(([rData, exData]) => {
      setRoutine(rData);
      setExercises(exData);
      if (rData.versions?.[0]) {
        setDays(rData.versions[0].days);
      }
      setName(rData.name);
      setLoading(false);
    });
  }, [params.id]);

  const updateRoutine = async () => {
    await fetch(`/api/routines/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, isActive: routine?.isActive }),
    });
    toast.success("Rutina actualizada");
    router.push("/routines");
  };

  const createNewVersion = async () => {
    const res = await fetch(`/api/routines/${params.id}/versions`, { method: "POST" });
    if (res.ok) {
      toast.success("Nueva versión creada");
      router.refresh();
    }
  };

  const addDay = () => {
    setDays((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, name: `Día ${prev.length + 1}`, order: prev.length, exercises: [] },
    ]);
  };

  const updateDayName = (idx: number, name: string) => {
    setDays((prev) => prev.map((d, i) => (i === idx ? { ...d, name } : d)));
  };

  const addExerciseToDay = (dayIdx: number, exerciseId: string) => {
    const ex = exercises.find((e) => e.id === exerciseId);
    if (!ex) return;
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? {
              ...d,
              exercises: [
                ...d.exercises,
                {
                  id: `new-${Date.now()}`,
                  exerciseId,
                  exercise: ex,
                  sets: 4,
                  reps: 10,
                  order: d.exercises.length,
                },
              ],
            }
          : d
      )
    );
  };

  const removeExerciseFromDay = (dayIdx: number, exIdx: number) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? { ...d, exercises: d.exercises.filter((_, j) => j !== exIdx) }
          : d
      )
    );
  };

  const updateExField = (dayIdx: number, exIdx: number, field: string, value: any) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIdx
          ? {
              ...d,
              exercises: d.exercises.map((ex, j) =>
                j === exIdx ? { ...ex, [field]: value } : ex
              ),
            }
          : d
      )
    );
  };

  const filteredExercises = exercises.filter((e) =>
    e.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  if (loading) {
    return <div className="animate-pulse text-muted-foreground">Cargando...</div>;
  }

  const version = routine?.versions?.[0];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/routines")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{routine?.name}</h1>
          <p className="text-sm text-muted-foreground">
            Versión {version?.version || 1} • {days.length} días
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={createNewVersion}>
            Nueva Versión
          </Button>
          <Button onClick={updateRoutine}>
            <Save className="h-4 w-4 mr-1" />
            Guardar
          </Button>
        </div>
      </div>

      <div>
        <Label>Nombre de la Rutina</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="max-w-md" />
      </div>

      <Separator />

      <div className="space-y-6">
        {days.map((day, dayIdx) => (
          <Card key={day.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Input
                  value={day.name}
                  onChange={(e) => updateDayName(dayIdx, e.target.value)}
                  className="max-w-xs font-medium"
                />
                <Button variant="ghost" size="icon" onClick={() => {
                  setDays((prev) => prev.filter((_, i) => i !== dayIdx));
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {day.exercises.map((ex, exIdx) => (
                <div key={ex.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ex.exercise?.name || "Ejercicio"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16">
                      <Input
                        type="number"
                        value={ex.sets || ""}
                        onChange={(e) => updateExField(dayIdx, exIdx, "sets", parseInt(e.target.value))}
                        className="h-8 text-center"
                        placeholder="S"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">×</span>
                    <div className="w-16">
                      <Input
                        type="number"
                        value={ex.reps || ""}
                        onChange={(e) => updateExField(dayIdx, exIdx, "reps", parseInt(e.target.value))}
                        className="h-8 text-center"
                        placeholder="R"
                      />
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeExerciseFromDay(dayIdx, exIdx)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar y agregar ejercicio..."
                  value={exerciseSearch}
                  onChange={(e) => setExerciseSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              {exerciseSearch && (
                <div className="border rounded-md max-h-40 overflow-y-auto">
                  {filteredExercises.slice(0, 8).map((ex) => (
                    <button
                      key={ex.id}
                      onClick={() => {
                        addExerciseToDay(dayIdx, ex.id);
                        setExerciseSearch("");
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                    >
                      {ex.name}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" onClick={addDay} className="w-full">
          <Plus className="h-4 w-4 mr-1" /> Agregar Día
        </Button>
      </div>
    </div>
  );
}
