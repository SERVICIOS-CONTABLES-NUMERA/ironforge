export const MUSCLE_GROUP_LABELS: Record<string, string> = {
  CHEST: "Pecho",
  BACK: "Espalda",
  SHOULDERS: "Hombros",
  BICEPS: "Bíceps",
  TRICEPS: "Tríceps",
  LEGS: "Piernas",
  GLUTES: "Glúteos",
  HAMSTRINGS: "Isquiotibiales",
  QUADS: "Cuádriceps",
  CALVES: "Pantorrillas",
  ABS: "Abdominales",
  FOREARMS: "Antebrazos",
  TRAPS: "Trapecios",
  FULL_BODY: "Cuerpo Completo",
  CARDIO: "Cardio",
};

export const EXERCISE_TYPE_LABELS: Record<string, string> = {
  STRENGTH: "Fuerza",
  HYPERTROPHY: "Hipertrofia",
  CARDIO: "Cardio",
  CALISTHENICS: "Calistenia",
  STRETCHING: "Estiramiento",
};

export const CARDIO_TYPE_LABELS: Record<string, string> = {
  TREADMILL: "Caminadora",
  BIKE: "Bicicleta",
  ELLIPTICAL: "Elíptica",
  WALKING: "Caminata",
  OTHER: "Otro",
};

export const RECORD_TYPE_LABELS: Record<string, string> = {
  MAX_WEIGHT: "Máximo Peso",
  MAX_VOLUME: "Máximo Volumen",
  MAX_REPS: "Máximas Repeticiones",
};

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/workout", label: "Entrenar Hoy", icon: "Dumbbell" },
  { href: "/routines", label: "Rutinas", icon: "NotebookText" },
  { href: "/exercises", label: "Ejercicios", icon: "Library" },
  { href: "/history", label: "Historial", icon: "History" },
  { href: "/progress", label: "Progreso", icon: "TrendingUp" },
  { href: "/cardio", label: "Cardio", icon: "Heart" },
  { href: "/bodyweight", label: "Peso Corporal", icon: "Weight" },
  { href: "/stats", label: "Estadísticas", icon: "BarChart3" },
  { href: "/settings", label: "Configuración", icon: "Settings" },
];
