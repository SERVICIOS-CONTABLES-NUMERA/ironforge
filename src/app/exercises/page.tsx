"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Edit, Trash2, Search, Dumbbell } from "lucide-react";
import { MUSCLE_GROUP_LABELS, EXERCISE_TYPE_LABELS } from "@/lib/constants";
import { toast } from "sonner";

interface Exercise {
  id: string;
  name: string;
  mainMuscleGroup: string;
  secondaryMuscleGroup: string | null;
  type: string;
  notes: string | null;
}

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [editExercise, setEditExercise] = useState<Exercise | null>(null);

  const fetchExercises = () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (groupFilter && groupFilter !== "all") params.set("group", groupFilter);
    fetch(`/api/exercises?${params}`)
      .then((r) => r.json())
      .then(setExercises)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchExercises(); }, [search, groupFilter]);

  const handleCreate = async (formData: FormData) => {
    const body = {
      name: formData.get("name"),
      mainMuscleGroup: formData.get("mainMuscleGroup"),
      secondaryMuscleGroup: formData.get("secondaryMuscleGroup") || null,
      type: formData.get("type"),
      notes: formData.get("notes") || null,
    };
    await fetch("/api/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setCreateOpen(false);
    fetchExercises();
    toast.success("Ejercicio creado");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/exercises/${id}`, { method: "DELETE" });
    fetchExercises();
    toast.success("Ejercicio eliminado");
  };

  if (loading) return <div className="animate-pulse text-muted-foreground">Cargando...</div>;

  const filtered = exercises;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ejercicios</h1>
          <p className="text-sm text-muted-foreground">Biblioteca de ejercicios</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Nuevo Ejercicio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Ejercicio</DialogTitle>
            </DialogHeader>
            <ExerciseForm onSubmit={handleCreate} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ejercicios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(MUSCLE_GROUP_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No hay ejercicios</p>
            <p className="text-sm text-muted-foreground">Crea tu primer ejercicio</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex) => (
            <Card key={ex.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm">{ex.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {MUSCLE_GROUP_LABELS[ex.mainMuscleGroup] || ex.mainMuscleGroup}
                      {ex.secondaryMuscleGroup && ` / ${MUSCLE_GROUP_LABELS[ex.secondaryMuscleGroup] || ex.secondaryMuscleGroup}`}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDelete(ex.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="text-xs">
                  {EXERCISE_TYPE_LABELS[ex.type] || ex.type}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ExerciseForm({ onSubmit, initial }: { onSubmit: (data: FormData) => void; initial?: any }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
      className="space-y-4"
    >
      <div>
        <Label>Nombre</Label>
        <Input name="name" defaultValue={initial?.name} required />
      </div>
      <div>
        <Label>Grupo Muscular Principal</Label>
        <Select name="mainMuscleGroup" defaultValue={initial?.mainMuscleGroup || "CHEST"}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(MUSCLE_GROUP_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Grupo Muscular Secundario</Label>
        <Select name="secondaryMuscleGroup" defaultValue={initial?.secondaryMuscleGroup || ""}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Ninguno</SelectItem>
            {Object.entries(MUSCLE_GROUP_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Tipo</Label>
        <Select name="type" defaultValue={initial?.type || "STRENGTH"}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(EXERCISE_TYPE_LABELS).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Notas</Label>
        <Input name="notes" defaultValue={initial?.notes} />
      </div>
      <Button type="submit" className="w-full">
        {initial ? "Actualizar" : "Crear"}
      </Button>
    </form>
  );
}
