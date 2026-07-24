import StatCard from "@/components/dashboard/StatCard";
import WorkoutCard from "@/components/dashboard/WorkCard";
import { Button } from "@/components/ui/button"
export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">

        <section> 
          <h1 className="text-3xl font-bold ">
            Good Morning, Dearborn 👋
          </h1>

          <p className="mt-2 text-grey-500">
            Tuesday, 21 July 
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <StatCard
          title="Total Workouts"
          value={34}
          />

          <StatCard 
          title="Total Sets"
          value={684}
          />

          <StatCard 
          title="Highiest Weight"
          value="180 kg"
          />

        </section>

        <section className="mt-10">

          <h2 className="text-xl font-semibold">
            Recent Workouts 
          </h2>

          <div className="mt-3">
            
            <WorkoutCard 
            name="Pull Day"
            date=" Yesterday"
            />

            <WorkoutCard 
            name="Push Day"
            date=" Monday"
            />

            <WorkoutCard
            name="Leg Day"
            date=" Thursday"
            />

          </div>
          </section>

          <section className="mt-10 flex justify-center">

            <Button className="rounded-lg bg-black px-6 py-3 font-medium text-white">
              + Create Workout
            </Button>
            
          </section>
          
          </div>
  );
}