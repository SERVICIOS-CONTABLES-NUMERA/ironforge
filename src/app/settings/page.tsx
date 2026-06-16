"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { Sun, Moon, Dumbbell, Github } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const handleExport = async () => {
    const data = await fetch("/api/sessions?limit=10000").then((r) => r.json());
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ironforge-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Datos exportados");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-sm text-muted-foreground">Personaliza tu experiencia</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Apariencia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <div>
                <Label>Modo Oscuro</Label>
                <p className="text-xs text-muted-foreground">Alternar entre tema claro y oscuro</p>
              </div>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Exportar Datos</Label>
              <p className="text-xs text-muted-foreground">Descargar todos los entrenamientos en JSON</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              Exportar
            </Button>
          </div>
          <Separator />
          <div>
            <Label className="text-destructive">Zona de Peligro</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Reinicia todos los datos de la aplicación
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm("¿Estás seguro? Esto eliminará TODOS los datos.")) {
                  toast.success("Funcionalidad disponible vía CLI: npx prisma migrate reset --force");
                }
              }}
            >
              Reiniciar Datos
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acerca de</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            <span className="font-medium text-foreground">IronForge</span>
            <span>v0.1.0</span>
          </div>
          <p>Dashboard de entrenamiento personal. Sin autenticación, sin suscripciones, sin complicaciones.</p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Github className="h-4 w-4" />
            Ver en GitHub
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
