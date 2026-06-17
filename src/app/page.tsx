"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatWeight, formatVolume, formatDuration } from "@/lib/utils";
import { MUSCLE_GROUP_LABELS } from "@/lib/constants";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from "recharts";
import { Flame, Trophy, Weight, Dumbbell, Heart, Zap, TrendingUp, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  streak: { current: number; best: number };
  currentWeight: number | null;
  avgMonthlyWeight: number | null;
  monthlySessions: number;
  totalVolume: number;
  weeklyVolume: number;
  monthlyVolume: number;
  recentRecords: any[];
  cardioTotal: { duration: number; calories: number };
  recentSessions: any[];
  weightHistory: { date: string; weight: number }[];
  weeklyBreakdown: { week: string; volume: number }[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  const stats = [
    {
      label: "Racha Actual",
      value: `${data.streak.current} días`,
      sub: `Mejor: ${data.streak.best} días`,
      icon: Flame,
      color: "text-orange-500",
    },
    {
      label: "Peso Corporal",
      value: data.currentWeight ? formatWeight(data.currentWeight) : "—",
      sub: data.avgMonthlyWeight ? `Prom. mensual: ${formatWeight(data.avgMonthlyWeight)}` : null,
      icon: Weight,
      color: "text-blue-500",
    },
    {
      label: "Entrenamientos",
      value: `${data.monthlySessions} este mes`,
      sub: "Sesiones completadas",
      icon: Dumbbell,
      color: "text-green-500",
    },
    {
      label: "Volumen Total",
      value: formatVolume(data.totalVolume),
      sub: `${formatVolume(data.weeklyVolume)} esta semana`,
      icon: Zap,
      color: "text-purple-500",
    },
    {
      label: "Cardio Total",
      value: formatDuration(data.cardioTotal.duration),
      sub: `${data.cardioTotal.calories} kcal quemadas`,
      icon: Heart,
      color: "text-red-500",
    },
    {
      label: "Récords",
      value: `${data.recentRecords.length} nuevos`,
      sub: "Últimos récords personales",
      icon: Trophy,
      color: "text-yellow-500",
    },
  ];

  const weeklyData = data.weeklyBreakdown?.length
    ? data.weeklyBreakdown
    : [{ week: "Sem 1", volume: data.weeklyVolume }];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Bienvenido a IronForge</p>
        </div>
        <Link href="/workout">
          <Button className="gap-2">
            <Dumbbell className="h-4 w-4" />
            Entrenar Hoy
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              {s.sub && <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolución de Peso Corporal</CardTitle>
          </CardHeader>
          <CardContent>
            {data.weightHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.weightHistory}>
                  <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })} fontSize={12} />
                  <YAxis domain={["auto", "auto"]} fontSize={12} />
                  <Tooltip labelFormatter={(v) => new Date(v).toLocaleDateString("es-ES")} formatter={(v: number) => [formatWeight(v), "Peso"]} />
                  <Line type="monotone" dataKey="weight" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Registra tu peso para ver la evolución</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Volumen Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(v: number) => [formatVolume(v), "Volumen"]} />
                <Bar dataKey="volume" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Últimos Entrenamientos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentSessions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Aún no hay entrenamientos registrados</p>
            ) : (
              data.recentSessions.map((session) => (
                <Link key={session.id} href={`/history`} className="block">
                  <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors">
                    <div>
                      <p className="text-sm font-medium">{formatDate(session.date)}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.routineVersion?.routine?.name || "Sin rutina"} • {session.exercises.length} ejercicios
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Récords Personales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentRecords.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Entrena para establecer tu primer récord</p>
            ) : (
              data.recentRecords.slice(0, 5).map((record: any) => (
                <div key={record.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <Sparkles className="h-4 w-4 text-yellow-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{record.exercise.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {record.weight} kg × {record.reps} reps
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-auto shrink-0">
                    {record.type === "MAX_WEIGHT" ? "Peso" : "Volumen"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
