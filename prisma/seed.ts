import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.personalRecord.deleteMany();
  await prisma.sessionExercise.deleteMany();
  await prisma.workoutSession.deleteMany();
  await prisma.cardioSession.deleteMany();
  await prisma.bodyweightLog.deleteMany();
  await prisma.routineDayExercise.deleteMany();
  await prisma.routineDay.deleteMany();
  await prisma.routineVersion.deleteMany();
  await prisma.routine.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.streak.deleteMany();

  // Create exercises
  const exercises = await Promise.all([
    prisma.exercise.create({ data: { name: "Press Banca", mainMuscleGroup: "CHEST", type: "STRENGTH" } }),
    prisma.exercise.create({ data: { name: "Press Inclinado", mainMuscleGroup: "CHEST", secondaryMuscleGroup: "SHOULDERS", type: "STRENGTH" } }),
    prisma.exercise.create({ data: { name: "Aperturas", mainMuscleGroup: "CHEST", type: "HYPERTROPHY" } }),
    prisma.exercise.create({ data: { name: "Press Militar", mainMuscleGroup: "SHOULDERS", type: "STRENGTH" } }),
    prisma.exercise.create({ data: { name: "Elevaciones Laterales", mainMuscleGroup: "SHOULDERS", type: "HYPERTROPHY" } }),
    prisma.exercise.create({ data: { name: "Remo Barra", mainMuscleGroup: "BACK", type: "STRENGTH" } }),
    prisma.exercise.create({ data: { name: "Jalón al Pecho", mainMuscleGroup: "BACK", type: "STRENGTH" } }),
    prisma.exercise.create({ data: { name: "Remo Polea Baja", mainMuscleGroup: "BACK", type: "HYPERTROPHY" } }),
    prisma.exercise.create({ data: { name: "Curl Barra", mainMuscleGroup: "BICEPS", type: "HYPERTROPHY" } }),
    prisma.exercise.create({ data: { name: "Curl Martillo", mainMuscleGroup: "BICEPS", type: "HYPERTROPHY" } }),
    prisma.exercise.create({ data: { name: "Press Francés", mainMuscleGroup: "TRICEPS", type: "HYPERTROPHY" } }),
    prisma.exercise.create({ data: { name: "Extensiones Tríceps", mainMuscleGroup: "TRICEPS", type: "HYPERTROPHY" } }),
    prisma.exercise.create({ data: { name: "Hack Squat", mainMuscleGroup: "QUADS", type: "STRENGTH" } }),
    prisma.exercise.create({ data: { name: "Peso Muerto Rumano", mainMuscleGroup: "HAMSTRINGS", secondaryMuscleGroup: "GLUTES", type: "STRENGTH" } }),
    prisma.exercise.create({ data: { name: "Zancadas", mainMuscleGroup: "LEGS", type: "STRENGTH" } }),
    prisma.exercise.create({ data: { name: "Extensiones Pierna", mainMuscleGroup: "QUADS", type: "HYPERTROPHY" } }),
    prisma.exercise.create({ data: { name: "Curl Femoral", mainMuscleGroup: "HAMSTRINGS", type: "HYPERTROPHY" } }),
    prisma.exercise.create({ data: { name: "Elevación de Talones", mainMuscleGroup: "CALVES", type: "HYPERTROPHY" } }),
    prisma.exercise.create({ data: { name: "Plancha", mainMuscleGroup: "ABS", type: "CALISTHENICS" } }),
    prisma.exercise.create({ data: { name: "Cortapicos", mainMuscleGroup: "ABS", type: "HYPERTROPHY" } }),
  ]);

  // Create routines
  const routine = await prisma.routine.create({
    data: { name: "Push Pull Legs", isActive: true },
  });

  const version = await prisma.routineVersion.create({
    data: { version: 1, routineId: routine.id },
  });

  // Day 1: Push
  const day1 = await prisma.routineDay.create({
    data: { name: "Día 1 - Push", routineVersionId: version.id, order: 0 },
  });

  const pushExercises = [
    { exerciseName: "Press Banca", sets: 4, reps: 8 },
    { exerciseName: "Press Inclinado", sets: 3, reps: 10 },
    { exerciseName: "Aperturas", sets: 3, reps: 12 },
    { exerciseName: "Press Militar", sets: 4, reps: 8 },
    { exerciseName: "Elevaciones Laterales", sets: 3, reps: 15 },
    { exerciseName: "Press Francés", sets: 3, reps: 10 },
  ];

  for (let i = 0; i < pushExercises.length; i++) {
    const ex = pushExercises[i];
    const found = exercises.find((e) => e.name === ex.exerciseName)!;
    await prisma.routineDayExercise.create({
      data: {
        routineDayId: day1.id,
        exerciseId: found.id,
        sets: ex.sets,
        reps: ex.reps,
        order: i,
      },
    });
  }

  // Day 2: Pull
  const day2 = await prisma.routineDay.create({
    data: { name: "Día 2 - Pull", routineVersionId: version.id, order: 1 },
  });

  const pullExercises = [
    { exerciseName: "Remo Barra", sets: 4, reps: 8 },
    { exerciseName: "Jalón al Pecho", sets: 4, reps: 10 },
    { exerciseName: "Remo Polea Baja", sets: 3, reps: 12 },
    { exerciseName: "Curl Barra", sets: 3, reps: 10 },
    { exerciseName: "Curl Martillo", sets: 3, reps: 12 },
  ];

  for (let i = 0; i < pullExercises.length; i++) {
    const ex = pullExercises[i];
    const found = exercises.find((e) => e.name === ex.exerciseName)!;
    await prisma.routineDayExercise.create({
      data: {
        routineDayId: day2.id,
        exerciseId: found.id,
        sets: ex.sets,
        reps: ex.reps,
        order: i,
      },
    });
  }

  // Day 3: Legs
  const day3 = await prisma.routineDay.create({
    data: { name: "Día 3 - Piernas", routineVersionId: version.id, order: 2 },
  });

  const legsExercises = [
    { exerciseName: "Hack Squat", sets: 4, reps: 8 },
    { exerciseName: "Peso Muerto Rumano", sets: 4, reps: 8 },
    { exerciseName: "Zancadas", sets: 3, reps: 10 },
    { exerciseName: "Extensiones Pierna", sets: 3, reps: 12 },
    { exerciseName: "Curl Femoral", sets: 3, reps: 12 },
    { exerciseName: "Elevación de Talones", sets: 4, reps: 15 },
  ];

  for (let i = 0; i < legsExercises.length; i++) {
    const ex = legsExercises[i];
    const found = exercises.find((e) => e.name === ex.exerciseName)!;
    await prisma.routineDayExercise.create({
      data: {
        routineDayId: day3.id,
        exerciseId: found.id,
        sets: ex.sets,
        reps: ex.reps,
        order: i,
      },
    });
  }

  // Create sample workout sessions (last 30 days)
  const today = new Date();
  const days = ["Día 1 - Push", "Día 2 - Pull", "Día 3 - Piernas"];
  const dayExercises = [pushExercises, pullExercises, legsExercises];

  for (let i = 30; i >= 0; i -= 2) {
    const dayIndex = (Math.floor(i / 2) % 3);
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const session = await prisma.workoutSession.create({
      data: {
        date,
        routineId: routine.id,
        routineVersionId: version.id,
        notes: null,
      },
    });

    const exs = dayExercises[dayIndex];
    for (let j = 0; j < exs.length; j++) {
      const ex = exs[j];
      const found = exercises.find((e) => e.name === ex.exerciseName)!;
      const baseWeight = 40 + Math.random() * 80;
      await prisma.sessionExercise.create({
        data: {
          sessionId: session.id,
          exerciseId: found.id,
          sets: ex.sets,
          reps: ex.reps,
          weight: Math.round(baseWeight * 2) / 2,
          rir: Math.floor(Math.random() * 3),
          order: j,
        },
      });
    }
  }

  // Create bodyweight logs
  for (let i = 90; i >= 0; i -= 3) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    await prisma.bodyweightLog.create({
      data: {
        date,
        weight: 75 + Math.sin(i * 0.1) * 3 + Math.random() * 0.5,
      },
    });
  }

  // Create cardio sessions
  for (let i = 20; i >= 0; i -= 4) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    await prisma.cardioSession.create({
      data: {
        date,
        type: "TREADMILL",
        duration: 20 + Math.floor(Math.random() * 20),
        distance: 2 + Math.random() * 3,
        calories: 150 + Math.floor(Math.random() * 150),
      },
    });
  }

  // Create streak
  await prisma.streak.create({
    data: { current: 5, best: 12 },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
