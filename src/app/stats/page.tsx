"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatVolume, formatWeight, formatDuration } from "@/lib/utils";
import { MUSCLE_GROUP_LABELS } from "@/lib/constants";
import { BarChart3, Flame, Trophy, AlertTriangle } from "lucide-react";

const COLORS = [
  "hsl(142, 76%, 36%)", "hsl(217, 91%, 60%)", "hsl(27, 96%, 61%)",
  "hsl(316, 70%, 50%)", "hsl(188, 86%, 53%)", "hsl(0, 84%, 60%)",
  "hsl(45, 93%, 47%)", "hsl(271, 91%, 65%)",
];

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/stats").then((r) => r.json()),
      fetch("/api/records").then((r) => r.json()),
      fetch("/api/sessions?limit=300").then((r) => r.json()),
    ]).then(([st, rec, sess]) => {
      setStats(st);
      setRecords(rec);
      setSessions(sess.sessions || []);
    });
  }, []);

  // Calculate muscle group distribution
  const muscleVolume: Record<string, number> = {};
  for (const session of sessions) {
    for (const ex of session.exercises || []) {
      const group = ex.exercise?.mainMuscleGroup || "OTHER";
      const vol = ex.weight * ex.sets * ex.reps;
      muscleVolume[group] = (muscleVolume[group] || 0) + vol;
    }
  }

  const muscleData = Object.entries(muscleVolume)
    .map(([name, value]) => ({ name: MUSCLE_GROUP_LABELS[name] || name, value }))
    .sort((a, b) => b.value - a.value);

  const totalVolume = muscleData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Estadísticas</h1>
        <p className="text-sm text-muted-foreground">Análisis detallado de tu entrenamiento</p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">General</TabsTrigger>
          <TabsTrigger value="muscles">Grupos Musculares</TabsTrigger>
          <TabsTrigger value="records">Récords</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Volumen Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatVolume(totalVolume)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Promedio por Sesión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {sessions.length > 0 ? formatVolume(Math.round(totalVolume / sessions.length)) : "—"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Sesiones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="muscles" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Volumen por Grupo Muscular</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={muscleData.slice(0, 8)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" fontSize={12} />
                    <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                    <Tooltip formatter={(v: number) => [formatVolume(v), "Volumen"]} />
                    <Bar dataKey="value" fill="hsl(142, 76%, 36%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribución</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={muscleData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {muscleData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [formatVolume(v), "Volumen"]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Todos los Récords</CardTitle>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Sin récords aún</p>
              ) : (
                <div className="space-y-2">
                  {records.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">{rec.exercise.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {rec.weight} kg × {rec.reps} reps
                          </p>
                        </div>
                      </div>
                      <Badge variant={rec.type === "MAX_WEIGHT" ? "default" : "secondary"}>
                        {rec.type === "MAX_WEIGHT" ? "Máx Peso" : "Máx Volumen"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
