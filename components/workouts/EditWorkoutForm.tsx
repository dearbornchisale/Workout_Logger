"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";


type Exercise = {
    id: number;
    exercise_name: string;
};

type Workout = {
    id: number;
    workout_date: string;
    notes: string | null;
    sets: {
        id: number;
        reps: number;
        weight: number;
        exercise_id: number;
    }[];
};

type EditWorkoutFormProps = {
    workout: Workout;
    exercises: Exercise[];
};

const EditWorkoutForm = ({ workout, exercises }: EditWorkoutFormProps) => {

    const supabase = createClient();
    const router = useRouter();

    const [date, setDate] = useState(workout.workout_date);
    const [notes, setNotes] = useState(workout.notes ?? "");
    const [sets, setSets] = useState(workout.sets.map((set) => ({
        id: (set.id),
        reps: String(set.reps),
        weight: String(set.weight),

    }))
    );

    const [selectedExerciseId, setSelectedExerciseId] = useState(workout.sets.length > 0
        ? String(workout.sets[0].exercise_id)
        : "");


    async function handleSaveWorkout(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!date || !selectedExerciseId || sets.length === 0) {
            alert("Please select a date, an exercise, and add at least one set.");
            return;
        }

        const invalidSet = sets.some(
            (set) =>
                set.reps.trim() === "" ||
                set.weight.trim() === "" ||
                Number(set.reps) <= 0 ||
                Number(set.weight) < 0 ||
                !Number.isFinite(Number(set.reps)) ||
                !Number.isFinite(Number(set.weight)) ||
                !Number.isInteger(Number(set.reps))
        );

        if (invalidSet) {
            alert("Please enter valid reps and weight for all sets.");
            return;
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            alert("You must be logged in to edit a workout.");
            return;
        }

        const { error: workoutUpdateError } = await supabase
            .from("workouts")
            .update({
                workout_date: date,
                notes: notes,
            })
            .eq("id", workout.id)
            .eq("user_id", user.id);

        if (workoutUpdateError) {
            console.log(workoutUpdateError.message);
            alert("Failed to update workout.");
            return;
        }

        const originalIds = workout.sets.map((set) => set.id);
        const currentIds = sets.map((set) => set.id);


        const deletedSetIds = originalIds.filter((id) => !currentIds.includes(id));

        if (deletedSetIds.length > 0) {
            const { error: deleteError } = await supabase
                .from("sets")
                .delete()
                .in("id", deletedSetIds)
                .eq("workout_id", workout.id);

            if (deleteError) {
                console.log(deleteError.message);
                alert("Failed to delete sets.");
                return;
            }


        }

        for (const [index, set] of sets.entries()) {
            if (originalIds.includes(set.id)) {
                const { error: updateError } = await supabase
                    .from("sets")
                    .update({
                        reps: Number(set.reps),
                        weight: Number(set.weight),
                        exercise_id: Number(selectedExerciseId),
                        set_number: index + 1,
                    })
                    .eq("id", set.id)
                    .eq("workout_id", workout.id);

                if (updateError) {
                    console.log(updateError.message);
                    alert("Failed to update sets.");
                    return;
                }
            }
        }

        const newSets = sets.filter((set) => !originalIds.includes(set.id));

        if (newSets.length > 0) {

            const setsToInsert = newSets.map((set) => ({
                workout_id: workout.id,
                reps: Number(set.reps),
                weight: Number(set.weight),
                exercise_id: Number(selectedExerciseId),
                set_number: sets.findIndex(
                    (currentSet) => currentSet.id === set.id) + 1

            }));

            const { error: insertError } = await supabase
                .from("sets")
                .insert(setsToInsert);

            if (insertError) {
                console.log(insertError.message);
                alert("Failed to insert new sets.");
                return;
            }

        }

        alert("Workout updated successfully!");
        router.push(`/workouts/${workout.id}`);
        router.refresh();

    }

    return (
        <form onSubmit={handleSaveWorkout} className="flex flex-col gap-4">
            <h2>Edit Workout</h2>

            <label htmlFor="workout_date">Workout Date:</label>
            <input type="date" id="workout_date" name="workout_date" value={date} onChange={(e) => setDate(e.target.value)} />

            <label htmlFor="notes">Notes:</label>
            <textarea id="notes" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />


            <label htmlFor="exercise">Exercise:</label>

            <select value={selectedExerciseId} onChange={(e) => setSelectedExerciseId(e.target.value)}>
                <option value="">Select an exercise</option>
                {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                        {exercise.exercise_name}
                    </option>
                ))}
            </select>

            <label htmlFor="sets">Sets:</label>
            {sets.map((set, index) => (
                <div key={set.id}>
                    <label htmlFor={`reps-${index}`}>Reps:</label>
                    <input
                        type="number"
                        id={`reps-${index}`}
                        name={`reps-${index}`}
                        value={set.reps}
                        onChange={(e) => {
                            const newSets = sets.map((currentSet) => {
                                if (currentSet.id === set.id) {
                                    return { ...currentSet, reps: e.target.value };
                                }
                                return currentSet;
                            });
                            setSets(newSets);
                        }}
                    />

                    <label htmlFor={`weight-${index}`}>Weight:</label>
                    <input
                        type="number"
                        id={`weight-${index}`}
                        name={`weight-${index}`}
                        value={set.weight}
                        onChange={(e) => {
                            const newSets = sets.map((currentSet) => {
                                if (currentSet.id === set.id) {
                                    return { ...currentSet, weight: e.target.value };
                                }
                                return currentSet;
                            });
                            setSets(newSets);
                        }}
                    />



                    <button type="button" onClick={() => {
                        const newSets = sets.filter((currentSet) => currentSet.id !== set.id);
                        setSets(newSets);
                    }}>
                        Remove Set

                    </button>

                </div>
            ))}

            <button type="button" onClick={() => {
                const newSet = {
                    id: Date.now(),
                    reps: "",
                    weight: "",
                };
                setSets([...sets, newSet]);
            }}>
                Add Set
            </button>


            <button type="submit">Save Changes </button>

        </form>

    );

}

export default EditWorkoutForm;




