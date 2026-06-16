"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
import { formatDate, formatWeight } from "@/lib/utils";
import { MUSCLE_GROUP_LABELS } from "@/lib/constants";
import { Search, History, ChevronRight, Copy, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

interface SessionExercise {
  id: string;
  exercise: { id: string; name: string; mainMuscleGroup: string };
  sets: number;
  reps: number;
  weight: number;
  rir: number | null;
}

interface WorkoutSession {
  id: string;
  date: string;
  notes: string | null;
  exercises: SessionExercise[];
  routineVersion?: { routine?: { name: string } };
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

  const fetchSessions = () => {
    const params = new URLSearchParams({ limit: "50", offset: "0" });
    if (search) params.set("exerciseId", search);
    fetch(`/api/sessions?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setSessions(data.sessions);
        setTotal(data.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSessions(); }, []);

  const deleteSession = async (id: string) => {
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    fetchSessions();
    toast.success("Sesión eliminada");
  };

  if (loading) return <div className="animate-pulse text-muted-foreground">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Historial</h1>
          <p className="text-sm text-muted-foreground">{total} entrenamientos registrados</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por ejercicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No hay entrenamientos</p>
            <p className="text-sm text-muted-foreground">Registra tu primer entrenamiento</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">{formatDate(session.date)}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.routineVersion?.routine?.name || "Sin rutina"} • {session.exercises.length} ejercicios
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedSession(session)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{formatDate(session.date)}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          {session.exercises.map((ex) => (
                            <div key={ex.id} className="flex items-center justify-between rounded-lg border p-3">
                              <div>
                                <p className="font-medium text-sm">{ex.exercise.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {ex.sets} × {ex.reps} @ {formatWeight(ex.weight)}
                                  {ex.rir != null && ` (RIR ${ex.rir})`}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" onClick={() => deleteSession(session.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {session.exercises.slice(0, 4).map((ex) => (
                    <Badge key={ex.id} variant="secondary" className="text-xs">
                      {ex.exercise.name}
                    </Badge>
                  ))}
                  {session.exercises.length > 4 && (
                    <Badge variant="outline" className="text-xs">+{session.exercises.length - 4}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
