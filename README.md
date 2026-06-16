# IronForge 🏋️

> Dashboard personal de entrenamiento de gimnasio. Sin autenticación, sin suscripciones, sin complicaciones.

IronForge es una aplicación web personal para registrar, gestionar, analizar y visualizar entrenamientos de gimnasio. Diseñada para un solo usuario, funcionando completamente en local.

## ✨ Características

- **Dashboard** con métricas clave: rachas, peso, volumen, récords
- **Entrenar Hoy**: registro rápido durante la sesión (menos de 2 minutos)
- **Rutinas flexibles**: las rutinas son plantillas, las sesiones son copias editables
- **Versionado de rutinas**: historial de cambios sin perder datos
- **Biblioteca de ejercicios**: catálogo centralizado reutilizable
- **Peso corporal**: registro y evolución gráfica
- **Cardio**: seguimiento de tiempo, distancia y calorías
- **Récords personales**: detección automática de nuevos récords
- **Rachas**: sistema automático de rachas estilo GitHub
- **Estadísticas**: volumen por grupo muscular, distribución, récords
- **Importación rápida**: pega texto plano y genera rutinas automáticamente
- **Modo oscuro / claro**
- **Responsive**: funciona en móvil y escritorio

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| UI | Tailwind CSS, Shadcn/UI |
| Charts | Recharts |
| Backend | Next.js API Routes |
| Base de datos | SQLite + Prisma ORM |
| Preparado para | PostgreSQL (cambiar provider en schema) |

## 📦 Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/ironforge.git
cd ironforge

# 2. Instalar dependencias
npm install

# 3. Configurar base de datos
npx prisma migrate dev --name init

# 4. (Opcional) Cargar datos de ejemplo
npm run db:seed

# 5. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## 🗄️ Scripts Disponibles

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Inicia servidor de producción |
| `npm run db:seed` | Carga datos de ejemplo |
| `npm run db:reset` | Reinicia la base de datos |
| `npm run db:studio` | Abre Prisma Studio |

## 📁 Estructura del Proyecto

```
ironforge/
├── prisma/
│   ├── schema.prisma    # Modelos de base de datos
│   └── seed.ts          # Datos de ejemplo
├── src/
│   ├── app/
│   │   ├── api/          # API Routes (Next.js)
│   │   ├── workout/      # Entrenar Hoy
│   │   ├── routines/     # Rutinas + detalle
│   │   ├── exercises/    # Biblioteca de ejercicios
│   │   ├── history/      # Historial de sesiones
│   │   ├── progress/     # Progreso y gráficas
│   │   ├── cardio/       # Registro de cardio
│   │   ├── bodyweight/   # Peso corporal
│   │   ├── stats/        # Estadísticas detalladas
│   │   ├── settings/     # Configuración
│   │   ├── page.tsx      # Dashboard principal
│   │   └── layout.tsx    # Layout raíz
│   ├── components/
│   │   ├── ui/           # Componentes shadcn/ui
│   │   └── layout/       # Sidebar, navegación
│   └── lib/
│       ├── prisma.ts     # Cliente Prisma singleton
│       ├── utils.ts      # Utilidades generales
│       └── constants.ts  # Constantes y etiquetas
├── .env.example
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🏛️ Filosofía

**Rutina = Plantilla. Sesión = Copia editable.**

- Las rutinas son plantillas reutilizables
- Cada sesión es una copia independiente que puedes modificar sin afectar la rutina
- Si cambias un ejercicio, peso o series durante el entrenamiento, no se modifica la rutina original
- Las rutinas tienen versionado para mantener el historial de cambios

## 🗃️ Modelos de Datos

- **Exercise**: catálogo centralizado de ejercicios con grupo muscular
- **Routine / RoutineVersion / RoutineDay / RoutineDayExercise**: rutinas versionadas con días y ejercicios
- **WorkoutSession / SessionExercise**: sesiones de entrenamiento con ejercicios registrados
- **BodyweightLog**: registro de peso corporal
- **CardioSession**: sesiones de cardio
- **PersonalRecord**: récords personales detectados automáticamente
- **Streak**: racha actual y mejor racha histórica

## 🔧 Personalización

Para migrar a PostgreSQL:

1. Cambiar `provider = "sqlite"` a `provider = "postgresql"` en `prisma/schema.prisma`
2. Actualizar `DATABASE_URL` en `.env`
3. Ejecutar `npx prisma migrate dev`

## 📄 Licencia

MIT
