import { createClient } from "@/lib/supabase-server";


export default async function HistoryPage() {

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: workouts, error } = await supabase
    .from("workouts")
    .select('id, workout_date, notes, sets (id, set_number, reps, weight, exercises ( exercise_name )) ')
    .eq("user_id", user.id)
    .order("workout_date", { ascending: false });

  if (error) {
    console.log(error.message);
    return;

  }


  return (

    <div className="mx-auto w-full max-w-5xl px-6 py-8">

      <h1 className="text-2xl font-bold"> Workout History </h1>

      {workouts.length === 0 ? (
        <p className="text-muted-foreground"> NO workouts yet. Log your first one  ! </p>) : (
        workouts.map((workout) => (
          <div key={workout.id}>
            <h2>{workout.workout_date}</h2>
            <p>{workout.notes}</p>

            {workout.sets.map((set) => (
              <p key={set.id}>
                {(set.exercises as unknown as { exercise_name: string }).exercise_name} — Set {set.set_number}: {set.reps} reps @ {set.weight}kg
              </p>
            ))}
          </div>
        ))
      )}



    </div>

  );
}