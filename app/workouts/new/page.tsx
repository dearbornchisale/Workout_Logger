"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
export default function CreateWorkoutPage() {
  const [sets, setSets] = useState(1);
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold"> New Workout</h1>

      <p className="mt-2 text-muted-foreground"> 
        Log your workout and track your progress 
      </p>

        <div className="mt-6 flex flex-col gap-4">

          <div className="flex flex-col gap-2">

            <label > Date </label>

            <input type="date" className="border rounded-md p-3" />

          </div>

          <div className="flex flex-col gap-2">

            <label> Notes </label>
            <textarea className="border rounded-md p-3 h-32" />

          </div>

          <h2 className="text-xl font-semibold"> Exercises </h2>

          <div className="flex flex-col gap-2"> 
            <label > Select an exercise </label>

            <select className="border rounded-md p-3 " >

              <option value={"Bench Press"}> Bench Press</option>
              <option value={"Barbell curls"}> Barbell curls </option>
              <option value={"Tricep pushdowns"}> Tricep pushdowns </option>
              <option value={"Bicep curls"}> Bicep curls </option>
            
            </select>
            
          </div>
          
          <div className="flex gap-4">

            <div className="flex flex-1 flex-col gap-2">

              <label> Set Number  </label>
              <input type="number" className="border rounded-md p-3"/>


            </div>

            <div className="flex flex-1 flex-col gap-2">

              <label> Reps </label>
              <input type="number" className="border rounded-md p-3" />

            </div>

            <div className="flex flex-1 flex-col gap-2">

              <label> Weight </label>
              <input type="number" className="border rounded-md p-3"/>

            </div>

            <Button 
            type="button" 
            className="rounded-lg bg-black px-6 py-3 font-medium text-white"
            onClick={() => setSets(sets + 1)}>
              Add Set 
            </Button>

          </div>
        </div>
    </main>
  );
}