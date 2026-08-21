"use client";

import { useState } from "react";

export default function TimeLogForm({
  onSaved,
}: {
  onSaved: () => void;
}) {
  const [workDate, setWorkDate] = useState("");
  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!workDate || !timeIn || !timeOut) {
      alert("Please enter the date, time in, and time out.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/timelogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workDate,
          timeIn,
          timeOut,
          remarks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to save time log.");
        return;
      }

      setWorkDate("");
      setTimeIn("");
      setTimeOut("");
      setRemarks("");

      onSaved();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date</label>
        <input
          type="date"
          value={workDate}
          onChange={(e) => setWorkDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Time In</label>
        <input
          type="time"
          value={timeIn}
          onChange={(e) => setTimeIn(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Time Out</label>
        <input
          type="time"
          value={timeOut}
          onChange={(e) => setTimeOut(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Remarks</label>
        <input
          type="text"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Optional"
        />
      </div>

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Time Log"}
      </button>
    </form>
  );
}