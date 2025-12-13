// app/events/new/EventForm.tsx
"use client";

import { FormEvent, useState } from "react";

export default function EventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [agendaText, setAgendaText] = useState("");
  const [tagsText, setTagsText] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const agendaArray = agendaText
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean);

      const tagsArray = tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      formData.delete("agenda");
      formData.delete("tags");

      formData.append("agenda", JSON.stringify(agendaArray));
      formData.append("tags", JSON.stringify(tagsArray));

      const res = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create event");

      setSuccess("Event created successfully");
      form.reset();
      setAgendaText("");
      setTagsText("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-semibold">Create Event</h1>

      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-6 bg-dark-100 p-8 rounded-xl"
      >
        {/* TITLE */}
        <Field label="Title">
          <input name="title" required placeholder="Event title" />
        </Field>

        {/* DESCRIPTION */}
        <Field label="Description">
          <textarea
            name="description"
            rows={3}
            required
            placeholder="Short description of the event"
          />
        </Field>

        {/* OVERVIEW */}
        <Field label="Overview">
          <textarea
            name="overview"
            rows={4}
            required
            placeholder="Detailed overview of the event"
          />
        </Field>

        {/* IMAGE */}
        <Field label="Image">
          <input name="image" type="file" accept="image/*" required />
          <p className="text-xs text-gray-500">
            Uploaded via API (Cloudinary, S3, etc.)
          </p>
        </Field>

        {/* VENUE + LOCATION */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Venue">
            <input name="venue" required />
          </Field>

          <Field label="Location">
            <input name="location" required />
          </Field>
        </div>

        {/* DATE + TIME */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Date">
            <input type="date" name="date" required />
          </Field>

          <Field label="Time">
            <input type="time" name="time" required />
          </Field>
        </div>

        {/* MODE + AUDIENCE */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Mode">
            <select name="mode" defaultValue="" required>
              <option value="" disabled>
                Select mode
              </option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </Field>

          <Field label="Audience">
            <input
              name="audience"
              required
              placeholder="Students, Developers, Designers"
            />
          </Field>
        </div>

        {/* AGENDA */}
        <Field label="Agenda (one item per line)">
          <textarea
            rows={4}
            value={agendaText}
            onChange={(e) => setAgendaText(e.target.value)}
            placeholder={`Intro\nKeynote\nQ&A\nNetworking`}
          />
        </Field>

        {/* ORGANIZER */}
        <Field label="Organizer">
          <input name="organizer" required />
        </Field>

        {/* TAGS */}
        <Field label="Tags (comma separated)">
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="tech, workshop, hackathon"
          />
        </Field>

        {/* STATUS */}
        {(error || success) && (
          <p className={`text-sm ${error ? "text-red-600" : "text-green-600"}`}>
            {error || success}
          </p>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}

/* ---------- */
/* Field UI   */
/* ---------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex flex-col gap-1 [&_input]:w-full [&_textarea]:w-full [&_select]:w-full [&_input]:rounded-md [&_textarea]:rounded-md [&_select]:rounded-md [&_input]:border [&_textarea]:border [&_select]:border [&_input]:px-3 [&_textarea]:px-3 [&_select]:px-3 [&_input]:py-2 [&_textarea]:py-2 [&_select]:py-2 [&_input]:text-sm [&_textarea]:text-sm [&_select]:text-sm focus-within:[&_input]:ring-2 focus-within:[&_textarea]:ring-2 focus-within:[&_select]:ring-2 focus-within:[&_input]:ring-blue-500 focus-within:[&_textarea]:ring-blue-500 focus-within:[&_select]:ring-blue-500">
        {children}
      </div>
    </div>
  );
}
