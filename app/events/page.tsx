import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import React from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const page = async () => {
  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();
  return (
    <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>

      <ul className="events">
        {events &&
          events.length > 0 &&
          events.map((event: IEvent) => (
            <li key={event.title} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default page;
