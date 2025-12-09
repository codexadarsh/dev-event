// app/events/new/EventForm.tsx
"use client";

import { FormEvent, useState } from "react";

type Mode = "online" | "offline" | "hybrid";

export default function EventForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // For user input of agenda & tags
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

      // Parse agenda (one item per line)
      const agendaArray = agendaText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      // Parse tags (comma-separated)
      const tagsArray = tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      // Remove any existing agenda/tags primitive entries
      formData.delete("agenda");
      formData.delete("tags");

      // Send as JSON strings (handle JSON.parse on the server)
      formData.append("agenda", JSON.stringify(agendaArray));
      formData.append("tags", JSON.stringify(tagsArray));

      const res = await fetch("/api/events", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to create event");
      }

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
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-semibold mb-6">Create Event</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title*
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Event title"
          />
        </div>

        {/* Description */}
        <div>
          <label
            className="block text-sm font-medium mb-1"
            htmlFor="description"
          >
            Description*
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={3}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Short description of the event"
          />
        </div>

        {/* Overview */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="overview">
            Overview*
          </label>
          <textarea
            id="overview"
            name="overview"
            required
            rows={4}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Detailed overview of the event"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="image">
            Image*
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            required
            className="w-full text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            This will be uploaded (e.g. to Cloudinary) in your API route.
          </p>
        </div>

        {/* Venue */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="venue">
            Venue*
          </label>
          <input
            id="venue"
            name="venue"
            type="text"
            required
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Hall A, Main Campus"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="location">
            Location*
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="City / Country / Online link info"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="date">
              Date*
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="time">
              Time*
            </label>
            <input
              id="time"
              name="time"
              type="time"
              required
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Mode */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="mode">
            Mode*
          </label>
          <select
            id="mode"
            name="mode"
            required
            defaultValue=""
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="" disabled>
              Select mode
            </option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Audience */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="audience">
            Audience*
          </label>
          <input
            id="audience"
            name="audience"
            type="text"
            required
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Students, Developers, Designers"
          />
        </div>

        {/* Agenda (string[]) */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="agenda">
            Agenda* (one item per line)
          </label>
          <textarea
            id="agenda"
            rows={4}
            value={agendaText}
            onChange={(e) => setAgendaText(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Intro & Welcome\nKeynote Session\nQ&A\nNetworking`}
          />
          <p className="mt-1 text-xs text-gray-500">
            Will be sent as a JSON array string in the <code>agenda</code>{" "}
            field.
          </p>
        </div>

        {/* Organizer */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="organizer">
            Organizer*
          </label>
          <input
            id="organizer"
            name="organizer"
            type="text"
            required
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Organizer / Organization name"
          />
        </div>

        {/* Tags (string[]) */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="tags">
            Tags* (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tech, workshop, hackathon"
          />
          <p className="mt-1 text-xs text-gray-500">
            Will be sent as a JSON array string in the <code>tags</code> field.
          </p>
        </div>

        {/* Status */}
        {(error || success) && (
          <div
            className={`text-sm ${error ? "text-red-600" : "text-green-600"}`}
          >
            {error || success}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:bg-gray-50"
        >
          {isSubmitting ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
