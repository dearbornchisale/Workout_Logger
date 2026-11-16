"use client";
import { useState } from "react";

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

    return (
        <form>
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

};

export default EditWorkoutForm;




