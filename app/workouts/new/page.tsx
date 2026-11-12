"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase-client";
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";



export default function CreateWorkoutPage() {

  const [sets, setSets] = useState([
    {
      id:1,
      weight:"",
      reps:"",
    }
  ]);

  const [workout_date, setWorkoutDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedExerciseId, setselectedExerciseId] = useState("");
  const [exercises, setExercises] = useState([
    {
     id:1,
     exercise_name:""
    }
  ]);

  useEffect(() => {
    
    async function loadExercises() {

      const supabase = createClient();

      const {data, error } = await  supabase.from("exercises").select("id, exercise_name");

      if (error){
        console.log(error.message)
        return;
      }
      
      setExercises(data);

      if (data.length > 0) {
        setselectedExerciseId(String(data[0].id));
      }

    }
    
    loadExercises();

  }, []);

  const router = useRouter();

  async function handleSubmitWorkout() {

    const supabase = createClient();

    const {data : {user}} = await supabase.auth.getUser();

    if(!user){
      return;
    }

    const user_id = user.id;

    const {data, error} = await supabase.from("workouts").insert({user_id, notes, workout_date }).select()

    if(error){
      console.log(error.message);
      return;
    }

    const newWorkoutId = data[0].id;

    const setsToInsert = sets.map((set, index) => {


      return{

        workout_id : newWorkoutId,
        exercise_id : Number(selectedExerciseId),
        set_number : index+1,
        reps: Number(set.reps),
        weight: Number(set.weight)

      
      };

      
    });

     const {error : setsError} = await supabase.from("sets").insert(setsToInsert);

      if(setsError){
        console.log(setsError.message);
        return;
      }

      router.push("/dashboard");
 
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold"> New Workout</h1>

      <p className="mt-2 text-muted-foreground"> 
        Log your workout and track your progress 
      </p>

        <div className="mt-6 flex flex-col gap-4">

          <div className="flex flex-col gap-2">

            <label > Date </label>

            <input type="date" value = {workout_date} className="border rounded-md p-3" onChange={(event) => {setWorkoutDate(event?.target.value)}} />

          </div>

          <div className="flex flex-col gap-2">

            <label> Notes </label>
            <textarea className="border rounded-md p-3 h-32"  value={notes} onChange={(event) => {setNotes(event?.target.value)}}/>

          </div>

          <h2 className="text-xl font-semibold"> Exercises </h2>

          <div className="flex flex-col gap-2"> 
            <label > Select an exercise </label>


              <select className="border rounded-md p-3 "

               value={selectedExerciseId} onChange={(event) => {setselectedExerciseId(event?.target.value)}} 
               
               >

                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}> {exercise.exercise_name} </option>
                ))}
            </select>
          </div>
          
            {sets.map((set,index) => 
              <div key={set.id} className="flex gap-4">

                  <div className="flex flex-1 flex-col gap-2">
                    <label> Set Number </label>
                    <input type="number" value={index + 1} readOnly className="border rounded-md p-3"/>
                  </div>

                  <div className="flex flex-1 flex-col gap-2"> 

                      <label> Reps </label>

                      <input type ="number" value={set.reps} className="border rounded-md p-3" onChange={(event )=> { 

                        const updatedSets = sets.map((currentSet) => {
                          if (currentSet.id === set.id){
                            return{
                              ...currentSet,
                              reps : event.target.value,
                            };
                          }
                          
                          return currentSet; 
                        });

                        setSets(updatedSets);
                        
                        console.log(event?.target.value);}}/>
                  </div> 

                  <div className="flex flex-1 flex-col gap-2">

                    <label> Weight </label>

                    <input type="number" value={set.weight} className="border rounded-md p-3" onChange={(event) => {

                      const updatedWeight = sets.map((currentWeight) => {
                        if(currentWeight.id === set.id){
                          return{
                            ...currentWeight,
                            weight : event.target.value,
                          };
                        }

                        return currentWeight;
                      });

                      setSets(updatedWeight);
                      console.log(event?.target.value);}}/>
                  </div>

              </div>

            )}

            <Button onClick={() => setSets([...sets, {
              id:Date.now(),
              reps: "",
              weight:"",
            }])}>
              Add Set 
            </Button>


            <Button onClick={ () => handleSubmitWorkout() }> Submit Workout </Button>

        </div>
    </main>
  );
}