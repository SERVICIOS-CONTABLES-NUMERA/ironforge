"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { formatDate, formatDuration } from "@/lib/utils";
import { CARDIO_TYPE_LABELS } from "@/lib/constants";
import { Plus, Heart, Timer, Flame, Route } from "lucide-react";
import { toast } from "sonner";

interface CardioSession {
  id: string;
  date: string;
  type: string;
  duration: number;
  distance: number | null;
  calories: number | null;
  notes: string | null;
}

interface CardioStats {
  duration: number;
  distance: number;
  calories: number;
  sessions: number;
  monthlyDuration: number;
}

export default function CardioPage() {
  const [sessions, setSessions] = useState<CardioSession[]>([]);
  const [stats, setStats] = useState<CardioStats>({ duration: 0, distance: 0, calories: 0, sessions: 0, monthlyDuration: 0 });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchData = () => {
    Promise.all([
      fetch("/api/cardio").then((r) => r.json()),
      fetch("/api/cardio/stats").then((r) => r.json()),
    ]).then(([s, st]) => {
      setSessions(s);
      setStats(st);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      date: new Date().toISOString(),
      type: form.type.value,
      duration: parseInt(form.duration.value),
      distance: parseFloat(form.distance.value) || null,
      calories: parseInt(form.calories.value) || null,
      notes: form.notes.value || null,
    };
    await fetch("/api/cardio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setOpen(false);
    fetchData();
    toast.success("Cardio registrado");
  };

  if (loading) return <div className="animate-pulse text-muted-foreground">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cardio</h1>
          <p className="text-sm text-muted-foreground">Registra tus sesiones de cardio</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Nuevo Cardio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Cardio</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label>Tipo</Label>
                <Select name="type" defaultValue="TREADMILL">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CARDIO_TYPE_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Duración (minutos)</Label>
                <Input name="duration" type="number" required />
              </div>
              <div>
                <Label>Distancia (km)</Label>
                <Input name="distance" type="number" step="0.1" />
              </div>
              <div>
                <Label>Calorías</Label>
                <Input name="calories" type="number" />
              </div>
              <Button type="submit" className="w-full">Guardar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Timer className="h-4 w-4" /> Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatDuration(stats.duration)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Route className="h-4 w-4" /> Distancia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.distance.toFixed(1)} km</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4" /> Calorías
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.calories}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Heart className="h-4 w-4" /> Sesiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.sessions}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de Cardio</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Sin sesiones registradas</p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{formatDate(s.date)}</p>
                    <p className="text-xs text-muted-foreground">
                      {CARDIO_TYPE_LABELS[s.type] || s.type} • {formatDuration(s.duration)}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    {s.distance && <p>{s.distance.toFixed(1)} km</p>}
                    {s.calories && <p className="text-xs text-muted-foreground">{s.calories} kcal</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
