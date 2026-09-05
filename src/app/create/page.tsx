"use client";

import { useEffect, useState } from "react";
import { ensureAnonymousUser } from "@/lib/supabase/ensure-anonymous-user";
import { createPlanAction } from "./actions";

export default function CreatePlanPage() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initialise() {
      try {
        await ensureAnonymousUser();
        setReady(true);
      } catch {
        setError("Unable to initialise your session.");
      }
    }

    initialise();
  }, []);

  if (error) {
    return <main>{error}</main>;
  }

  if (!ready) {
    return <main>Loading...</main>;
  }

  return (
    <main>
      <h1>Create a plan</h1>

      <form action={createPlanAction}>
        <div>
          <label htmlFor="title">Plan title</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            maxLength={500}
          />
        </div>

        <div>
          <label htmlFor="startDate">Start date</label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            required
          />
        </div>

        <div>
          <label htmlFor="endDate">End date</label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            required
          />
        </div>

        <div>
          <label htmlFor="durationMinutes">Duration in minutes</label>
          <input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min="1"
            required
          />
        </div>

        <div>
          <label htmlFor="responseDeadline">Response deadline</label>
          <input
            id="responseDeadline"
            name="responseDeadline"
            type="datetime-local"
            required
          />
        </div>

        <button type="submit">Create plan</button>
      </form>
    </main>
  );
}