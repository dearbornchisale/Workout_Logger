import StatCard from "@/components/dashboard/StatCard";
import WorkoutCard from "@/components/dashboard/WorkCard";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-server";
import Link from "next/link";


export default async function DashboardPage() {

  const supabase = await createClient();


  const { data: { user }, } = await supabase.auth.getUser()

  if (!user) return null;

  const googleName = user.user_metadata?.full_name || user.user_metadata?.name;

  const emailName = user.email?.split("@")[0].replace(/[._-]/g, " ");

  const userName = googleName || emailName || "User";


  const { count, error } = await supabase
    .from("workouts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (error) {
    console.log(error.message);
    return
  }

  const totalWorkout = count || 0;

  const { count: setsCount, error: setsError } = await supabase
    .from("sets")
    .select("*, workouts!inner(user_id)", { count: "exact", head: true })
    .eq("workouts.user_id", user.id)

  if (setsError) {
    console.log(setsError.message);
    return
  }

  const totalSets = setsCount || 0;

  const { data: maxWeight, error: weightError } = await supabase
    .from("sets")
    .select("weight, workouts!inner(user_id)")
    .eq("workouts.user_id", user.id)
    .order("weight", { ascending: false })
    .limit(1);

  if (weightError) {
    console.log(weightError.message)
    return;
  }

  const maxWeightValue = maxWeight[0]?.weight || 0;

  const { data: recentWorkouts, error: recentWorkoutsError } = await supabase
    .from("workouts")
    .select("id, workout_date, notes")
    .order("workout_date", { ascending: false })
    .eq("user_id", user.id)
    .limit(3)

  if (recentWorkoutsError) {
    console.log(recentWorkoutsError.message);
    return;
  }

  const currentDate = new Date();
  const today = currentDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });



  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">

      <section>
        <h1 className="text-3xl font-bold ">
          Welcome Back, {userName} 👋
        </h1>

        <p className="mt-2 text-gray-500">
          {today}
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Workouts"
          value={totalWorkout}

        />

        <StatCard
          title="Total Sets"
          value={totalSets}
        />

        <StatCard
          title="Highest Weight"
          value={maxWeightValue}
        />

      </section>

      <section className="mt-10">

        <h2 className="text-xl font-semibold">
          Recent Workouts
        </h2>

        <div className="mt-3">

          {recentWorkouts.length === 0 ? (
            <p className="text-muted-foreground"> No workouts yet. Log your first one ! </p>) : (recentWorkouts.map((workout) =>

              <WorkoutCard key={workout.id} name={workout.notes || "Workout"} date={workout.workout_date} />
            ))}


        </div>
      </section>

      <section className="mt-10 flex justify-center">

        <Link
          href="/workouts/new"
          className={buttonVariants({ size: "lg" })}
        >
          + Create New Workout

        </Link>
      </section>

    </div>
  );
}
