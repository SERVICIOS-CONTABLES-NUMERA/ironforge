"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { formatDate, formatWeight } from "@/lib/utils";
import { Plus, Weight, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface BodyweightLog {
  id: string;
  date: string;
  weight: number;
  bodyFat: number | null;
  notes: string | null;
}

export default function BodyweightPage() {
  const [logs, setLogs] = useState<BodyweightLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchLogs = () => {
    fetch("/api/bodyweight")
      .then((r) => r.json())
      .then(setLogs)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    await fetch("/api/bodyweight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date().toISOString(),
        weight: parseFloat(form.weight.value),
        bodyFat: form.bodyFat.value ? parseFloat(form.bodyFat.value) : null,
      }),
    });
    setOpen(false);
    fetchLogs();
    toast.success("Peso registrado");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/bodyweight/${id}`, { method: "DELETE" });
    fetchLogs();
  };

  if (loading) return <div className="animate-pulse text-muted-foreground">Cargando...</div>;

  const chartData = logs.slice(-90);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Peso Corporal</h1>
          <p className="text-sm text-muted-foreground">Registra y visualiza tu evolución</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Registrar Peso
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Peso</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label>Peso (kg)</Label>
                <Input name="weight" type="number" step="0.1" required />
              </div>
              <div>
                <Label>% Grasa Corporal (opcional)</Label>
                <Input name="bodyFat" type="number" step="0.1" />
              </div>
              <Button type="submit" className="w-full">Guardar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evolución</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
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
            <p className="text-sm text-muted-foreground text-center py-8">Registra tu peso para ver la evolución</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Sin registros</p>
          ) : (
            <div className="space-y-2">
              {[...logs].reverse().map((log) => (
                <div key={log.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{formatDate(log.date)}</p>
                    {log.bodyFat && <p className="text-xs text-muted-foreground">{log.bodyFat}% grasa</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{formatWeight(log.weight)}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(log.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
