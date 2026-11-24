import { createClient } from '@/lib/supabase-server';
import { redirect } from "next/navigation";

export default async function ProgressPage() {

  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const { data: sets, error } = await supabase
    .from('sets')
    .select("weight, reps, exercises(exercise_name), workouts!inner(user_id, workout_date)")
    .eq("workouts.user_id", user.id);


  if (error) {
    throw new Error(`Failed to fetch personal bests: ${error.message}`);
  }

  type ProgressSet = {

    weight: number;
    reps: number;
    exercises: { exercise_name: string } | null;
    workouts: { user_id: string; workout_date: string } | null;

  };

  const progressSets = (sets ?? []) as unknown as ProgressSet[];


  const personalBest = new Map<
    string,
    { weight: number; date: string }
  >();

  progressSets.forEach((set) => {

    const exerciseName = set.exercises?.exercise_name;
    const weight = set.weight;
    const date = set.workouts?.workout_date;

    if (!exerciseName || !date || weight <= 0) {
      return;
    }

    const existingBest = personalBest.get(exerciseName);

    const isHeavier = !existingBest || weight > existingBest.weight;

    const isSameWeight =
      existingBest &&
      weight === existingBest.weight &&
      date < existingBest.date;

    if (isHeavier || isSameWeight) {
      personalBest.set(exerciseName, {
        weight,
        date
      });
    }



  });

  const personalBestArray = Array.from(personalBest.entries());

  console.log("Personal Bests:", personalBestArray);


  return (

    <main>
      <h1> Progress  </h1>

      <section>
        <h2> Personal Best </h2>

        {personalBestArray.length === 0 ? (
          <p> No personal best recorded yet. </p>

        ) : (
          <div>
            {personalBestArray.map(([exerciseName, best]) => (
              <div key={exerciseName}>
                <h3> {exerciseName} </h3>
                <p> {best.weight} kg </p>
                <p> {best.date} </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>



  );
}