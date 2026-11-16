    import { createClient } from "@/lib/supabase-server";
    import { notFound } from "next/navigation";
    import EditWorkoutForm from "@/components/workouts/EditWorkoutForm";


    export default async function EditWorkoutPage({
        params,
    }: {
        params: Promise<{ id: string }>;
    }) {
        const { id } = await params;

        const supabase = await createClient();

        const {data : { user } } = await supabase.auth.getUser();

        if (!user) return null;


        
        const { data: workout,  error } = await supabase
            .from("workouts")
            .select("*, sets(*, exercises(*))")
            .eq("id", Number(id))
            .eq("user_id", user.id)
            .single();

        if (error || !workout) {
            console.log(error?.message);
            notFound();
        }

        const {data: exercises, error: exercisesError } = await supabase
            .from("exercises")
            .select("*")
            

        if (exercisesError) {
            console.log(exercisesError?.message);
           notFound();
        }
            


      
        return (
            <div className="mx-auto w-full max-w-5xl px-6 py-8">
                <h1 className="text-3xl font-bold">Edit Workout</h1>
                <EditWorkoutForm workout={workout} exercises={exercises} />



            </div>
        );
    }