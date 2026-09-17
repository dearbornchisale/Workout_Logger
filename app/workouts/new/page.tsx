"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CreateWorkoutPage() {
  const [sets, setSets] = useState([
    {
      id:1,
      weight:"",
      reps:"",
    }
  ]);

  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [exercise, setExercise] = useState("");
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold"> New Workout</h1>

      <p className="mt-2 text-muted-foreground"> 
        Log your workout and track your progress 
      </p>

        <div className="mt-6 flex flex-col gap-4">

          <div className="flex flex-col gap-2">

            <label > Date </label>

            <input type="date" value = {date} className="border rounded-md p-3" onChange={(event) => {setDate(event?.target.value)}} />

          </div>

          <div className="flex flex-col gap-2">

            <label> Notes </label>
            <textarea className="border rounded-md p-3 h-32"  value={notes} onChange={(event) => {setNotes(event?.target.value)}}/>

          </div>

          <h2 className="text-xl font-semibold"> Exercises </h2>

          <div className="flex flex-col gap-2"> 
            <label > Select an exercise </label>

            <select className="border rounded-md p-3 " value={exercise} onChange={(event) => {setExercise(event?.target.value)}} >

              <option value={"Bench Press"}> Bench Press</option>
              <option value={"Barbell curls"}> Barbell curls </option>
              <option value={"Tricep pushdowns"}> Tricep pushdowns </option>
              <option value={"Bicep curls"}> Bicep curls </option>
            
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

            

          
        </div>
    </main>
  );
}