import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import { getSimilarEventBySlug } from "@/lib/actions/event.actions";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailsItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}
      </div>
    ))}
  </div>
);
const EventDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
  }

  const request = await fetch(`${BASE_URL}/api/events/${slug}`);

  if (!request.ok) {
    return notFound();
  }

  const response = await request.json();

  if (!response.event) {
    return notFound();
  }

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventBySlug(slug);
  const {
    event: {
      description,
      image,
      overview,
      date,
      time,
      location,
      mode,
      agenda,
      audience,
      tags,
      organizer,
    },
  } = response;

  if (!description) return notFound();

  return (
    <section id="event">
      <div className="header">
        <h1>Event Description</h1>
        <p className="mt-2">{description}</p>
      </div>
      <div>
        <div className="details">
          <div className="content">
            <Image
              src={image}
              alt="Event banner"
              width={800}
              height={800}
              className="banner"
            />
            <section className="flex-col-gap-2">
              <h2>Overview</h2>
              <p>{overview}</p>
            </section>

            <section className="flex-col-gap-2">
              <h2>Event Details</h2>

              <EventDetailsItem
                icon="/icons/calendar.svg"
                alt="calendar"
                label={date}
              />
              <EventDetailsItem
                icon="/icons/clock.svg"
                alt="clock"
                label={time}
              />
              <EventDetailsItem
                icon="/icons/pin.svg"
                alt="pin"
                label={location}
              />
              <EventDetailsItem
                icon="/icons/mode.svg"
                alt="mode"
                label={mode}
              />
              <EventDetailsItem
                icon="/icons/audience.svg"
                alt="audience"
                label={audience}
              />
            </section>

            <EventAgenda agendaItems={agenda} />

            <section className="flex-col-gap-2">
              <h2>About the Organizer</h2>
              <p>{organizer}</p>
            </section>
            <EventTags tags={tags} />
          </div>
          <aside className="booking">
            <div className="signup-card">
              <h2>Book Your Spot</h2>
              {bookings && bookings > 0 ? (
                <p className="text-sm">
                  Join {bookings} people who already booked this event
                </p>
              ) : (
                <p className="text-sm">be the first to book this event</p>
              )}
              <BookEvent />
            </div>
          </aside>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Event</h2>
        <div className="events">
          {similarEvents.length > 0 &&
            similarEvents.map((similarEvents: IEvent) => (
              <EventCard key={similarEvents.title} {...similarEvents} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
