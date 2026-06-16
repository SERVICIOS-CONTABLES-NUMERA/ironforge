"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Play,
  Pause,
  FileUp,
  ChevronRight,
  Dumbbell,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";

interface Routine {
  id: string;
  name: string;
  isActive: boolean;
  versions: RoutineVersion[];
}

interface RoutineVersion {
  id: string;
  version: number;
  days: RoutineDay[];
}

interface RoutineDay {
  id: string;
  name: string;
  order: number;
  exercises: any[];
}

export default function RoutinesPage() {
  const router = useRouter();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [importText, setImportText] = useState("");

  const fetchRoutines = () => {
    fetch("/api/routines")
      .then((r) => r.json())
      .then(setRoutines)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRoutines(); }, []);

  const createRoutine = async () => {
    if (!newName.trim()) return toast.error("Ingresa un nombre");
    await fetch("/api/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, days: [] }),
    });
    setNewName("");
    setCreateOpen(false);
    fetchRoutines();
    toast.success("Rutina creada");
  };

  const toggleActive = async (routine: Routine) => {
    // Deactivate all, then activate selected
    for (const r of routines) {
      if (r.isActive) {
        await fetch(`/api/routines/${r.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: false }),
        });
      }
    }
    await fetch(`/api/routines/${routine.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !routine.isActive }),
    });
    fetchRoutines();
  };

  const deleteRoutine = async (id: string) => {
    await fetch(`/api/routines/${id}`, { method: "DELETE" });
    fetchRoutines();
    toast.success("Rutina eliminada");
  };

  const duplicateRoutine = async (routine: Routine) => {
    const v = routine.versions[0];
    await fetch("/api/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${routine.name} (copia)`,
        days: v?.days.map((d) => ({
          name: d.name,
          exercises: d.exercises.map((e: any) => ({
            exerciseId: e.exerciseId,
            sets: e.sets,
            reps: e.reps,
          })),
        })) || [],
      }),
    });
    fetchRoutines();
    toast.success("Rutina duplicada");
  };

  const importRoutine = async () => {
    const lines = importText.split("\n").filter((l) => l.trim());
    const days: { name: string; exercises: { exerciseId: string }[] }[] = [];
    let currentDay: { name: string; exercises: { exerciseId: string }[] } | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().startsWith("día") || trimmed.toLowerCase().startsWith("dia")) {
        currentDay = { name: trimmed, exercises: [] };
        days.push(currentDay);
      } else if (currentDay) {
        // Try to find the exercise
        const exs = await fetch(`/api/exercises?q=${encodeURIComponent(trimmed)}`).then((r) => r.json());
        if (exs.length > 0) {
          currentDay.exercises.push({ exerciseId: exs[0].id });
        }
      }
    }

    await fetch("/api/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Rutina Importada", days }),
    });
    setImportText("");
    setImportOpen(false);
    fetchRoutines();
    toast.success("Rutina importada");
  };

  if (loading) {
    return <div className="animate-pulse text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rutinas</h1>
          <p className="text-sm text-muted-foreground">Gestiona tus rutinas de entrenamiento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <FileUp className="h-4 w-4 mr-1" />
            Importar
          </Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Nueva Rutina
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Rutina</DialogTitle>
                <DialogDescription>Nueva rutina de entrenamiento</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Nombre</Label>
                  <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej: Hipertrofia V1" />
                </div>
                <Button onClick={createRoutine} className="w-full">Crear</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={importOpen} onOpenChange={setImportOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Importar Rutina</DialogTitle>
                <DialogDescription>
                  Pega el texto de tu rutina. Usa "Día 1", "Día 2", etc. para separar los días.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <textarea
                  className="w-full h-40 rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder={`Día 1 - Pecho\nPress Banca\nPress Inclinado\nAperturas\n\nDía 2 - Espalda\nRemo Barra\nJalón al Pecho`}
                />
                <Button onClick={importRoutine} className="w-full">Importar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {routines.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No hay rutinas</p>
            <p className="text-sm text-muted-foreground">Crea tu primera rutina para empezar</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {routines.map((routine) => {
            const v = routine.versions[0];
            const dayCount = v?.days?.length || 0;

            return (
              <Card key={routine.id} className={routine.isActive ? "ring-1 ring-primary" : ""}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{routine.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        V{routine.versions[0]?.version || 1} • {dayCount} días
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleActive(routine)}>
                          {routine.isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                          {routine.isActive ? "Desactivar" : "Activar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/routines/${routine.id}`)}>
                          <Edit className="h-4 w-4 mr-2" />Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => duplicateRoutine(routine)}>
                          <Copy className="h-4 w-4 mr-2" />Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteRoutine(routine.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  {routine.isActive && <Badge variant="default" className="mb-2">Activa</Badge>}
                  <div className="space-y-1">
                    {v?.days?.slice(0, 3).map((day) => (
                      <div key={day.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        <span>{day.name}</span>
                        <span className="ml-auto">{day.exercises.length} ej.</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
