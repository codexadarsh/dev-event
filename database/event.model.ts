import mongoose, { Document, Model, Schema } from "mongoose";

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema definition
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Event overview is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Event image is required"],
    },
    venue: {
      type: String,
      required: [true, "Event venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Event location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    mode: {
      type: String,
      required: [true, "Event mode is required"],
      enum: ["online", "offline", "hybrid"],
      lowercase: true,
    },
    audience: {
      type: String,
      required: [true, "Target audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Event agenda is required"],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "Agenda must contain at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Event organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Event tags are required"],
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "At least one tag is required",
      },
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Pre-save hook: Generate slug from title and normalize date/time
eventSchema.pre("save", async function () {
  const event = this as IEvent;

  // Generate slug only if title is new or modified
  if (event.isModified("title")) {
    event.slug = event.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

    // Ensure slug uniqueness by appending a timestamp if needed
    const existingEvent = await mongoose.models.Event.findOne({
      slug: event.slug,
      _id: { $ne: event._id },
    });

    if (existingEvent) {
      event.slug = `${event.slug}-${Date.now()}`;
    }
  }

  // Normalize date to ISO format if modified
  if (event.isModified("date")) {
    try {
      const parsedDate = new Date(event.date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }
      event.date = parsedDate.toISOString().split("T")[0]; // Store as YYYY-MM-DD
    } catch (error) {
      throw new Error("Date must be a valid date string");
    }
  }

  // Normalize time format if modified (convert to HH:MM format)
  if (event.isModified("time")) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const time12HourRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

    if (timeRegex.test(event.time)) {
      // Already in 24-hour format (HH:MM)
      event.time = event.time;
    } else if (time12HourRegex.test(event.time)) {
      // Convert 12-hour format to 24-hour format
      const match = event.time.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
      if (match) {
        let hours = parseInt(match[1]);
        const minutes = match[2];
        const period = match[3].toUpperCase();

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        event.time = `${hours.toString().padStart(2, "0")}:${minutes}`;
      }
    } else {
      throw new Error("Time must be in HH:MM or HH:MM AM/PM format");
    }
  }
});

// Export the model
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);

export default Event;
