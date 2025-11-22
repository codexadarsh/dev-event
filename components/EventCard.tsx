import Link from "next/link";
import Image from "next/image";
interface Props {
  // Define any props you want to pass to the EventCard component
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}
const EventCard = ({ title, image, slug, location, date, time }: Props) => {
  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />
      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="Location pin" width={16} height={16} />
        <p>{location}</p>
      </div>

      <p className="title">{title}</p>

      <div className="datetime">
        <div>
          <Image
            src="/icons/calendar.svg"
            alt="Date icon"
            width={16}
            height={16}
          />
          <p>{date}</p>
        </div>
        <div>
          <Image
            src="/icons/clock.svg"
            alt="Time icon"
            width={16}
            height={16}
          />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
