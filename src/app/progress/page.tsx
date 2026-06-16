"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { formatVolume, formatWeight } from "@/lib/utils";
import { MUSCLE_GROUP_LABELS } from "@/lib/constants";
import { TrendingUp, BarChart3 } from "lucide-react";

export default function ProgressPage() {
  const [weightData, setWeightData] = useState<any[]>([]);
  const [exerciseData, setExerciseData] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [exercises, setExercises] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/bodyweight").then((r) => r.json()),
      fetch("/api/exercises").then((r) => r.json()),
      fetch("/api/sessions?limit=200").then((r) => r.json()),
    ]).then(([bw, exs, sess]) => {
      setWeightData(bw);
      setExercises(exs);
      setSessions(sess.sessions || []);
    });
  }, []);

  // Process exercise progress
  useEffect(() => {
    if (!selectedExercise || !sessions.length) {
      setExerciseData([]);
      return;
    }
    const data: any[] = [];
    for (const session of sessions) {
      const ex = session.exercises?.find((e: any) => e.exerciseId === selectedExercise);
      if (ex) {
        data.push({
          date: session.date,
          weight: ex.weight,
          volume: ex.weight * ex.sets * ex.reps,
        });
      }
    }
    setExerciseData(data);
  }, [selectedExercise, sessions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Progreso</h1>
        <p className="text-sm text-muted-foreground">Evolución de tus entrenamientos</p>
      </div>

      <Tabs defaultValue="weight">
        <TabsList>
          <TabsTrigger value="weight">Peso Corporal</TabsTrigger>
          <TabsTrigger value="exercise">Por Ejercicio</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Evolución de Peso</CardTitle>
            </CardHeader>
            <CardContent>
              {weightData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(v) => new Date(v).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
                      fontSize={12}
                    />
                    <YAxis domain={["dataMin - 2", "dataMax + 2"]} fontSize={12} />
                    <Tooltip
                      labelFormatter={(v) => new Date(v).toLocaleDateString("es-ES")}
                      formatter={(v: number) => [formatWeight(v), "Peso"]}
                    />
                    <Line type="monotone" dataKey="weight" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Sin datos de peso</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercise" className="space-y-4">
          <div className="flex items-center gap-3">
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Seleccionar ejercicio" />
              </SelectTrigger>
              <SelectContent>
                {exercises.map((ex) => (
                  <SelectItem key={ex.id} value={ex.id}>{ex.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {exerciseData.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Progresión de Peso</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={exerciseData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })} fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(v: number) => [formatWeight(v), "Peso"]} />
                      <Line type="monotone" dataKey="weight" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Volumen por Sesión</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={exerciseData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })} fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip formatter={(v: number) => [formatVolume(v), "Volumen"]} />
                      <Bar dataKey="volume" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {!selectedExercise && (
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Selecciona un ejercicio</p>
                <p className="text-sm text-muted-foreground">Elige un ejercicio para ver su progreso</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
