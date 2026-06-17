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

export const NAV_ICONS: Record<string, React.ReactNode> = {
  LayoutDashboard: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
  Dumbbell: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 5.343a1 1 0 0 1 0 1.414l-.707.707a1 1 0 0 1-1.414 0l-5.657-5.657a1 1 0 0 1 0-1.414l.707-.707a1 1 0 0 1 1.414 0Z"/><path d="M6.343 18.657a1 1 0 0 1 0-1.414l.707-.707a1 1 0 0 1 1.414 0l5.657 5.657a1 1 0 0 1 0 1.414l-.707.707a1 1 0 0 1-1.414 0Z"/><path d="m14.4 9.6 2.7-2.7"/><path d="m9.6 14.4-2.7 2.7"/></svg>,
  NotebookText: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M16 2v20"/></svg>,
  Library: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>,
  History: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  TrendingUp: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Heart: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  Weight: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.46A2 2 0 0 0 17.5 8Z"/></svg>,
  BarChart3: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  Settings: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
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
