"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";   


type DeleteWorkoutButtonProps = {
  workoutId: number;
};

export default function DeleteWorkoutButton({ workoutId }: DeleteWorkoutButtonProps) {

  const router = useRouter();

  async function handleDeleteWorkout() {

    const confirm = window.confirm("Are you sure you want to delete this workout? This action cannot be undone.");

    if (!confirm) {
      return;
    }



    const supabase = createClient();

    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", workoutId);

    if (error) {
      console.log(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <Button onClick={handleDeleteWorkout} className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700">
      Delete Workout
    </Button>
  );



}