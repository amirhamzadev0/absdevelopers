import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import type { ContactChannel, Office } from "@/models/site";

const icons = { phone: Phone, whatsapp: MessageCircle, email: Mail } as const;

interface ContactChannelsProps {
  channels: ContactChannel[];
  office: Office;
}

export function ContactChannels({ channels, office }: ContactChannelsProps) {
  const mapQuery = encodeURIComponent(`${office.address}, ${office.city}, Pakistan`);
  return (
    <>
      <Reveal stagger className="channel-grid">
        {channels.map((channel) => {
          const Icon = icons[channel.id];
          const external = channel.href.startsWith("http");
          return (
            <a
              key={channel.id}
              className="channel-card"
              href={channel.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              <Icon className="channel-card__icon" size={22} aria-hidden="true" />
              <span className="channel-card__label">{channel.label}</span>
              <span className="channel-card__value">{channel.value}</span>
              <span className="channel-card__note">{channel.note}</span>
            </a>
          );
        })}
      </Reveal>

      <div className="office-card">
        <div>
          <span className="eyebrow">Head Office</span>
          <h2 className="office-card__title">{office.label}</h2>
          <p className="office-card__address">
            {office.address}, {office.city}
          </p>
        </div>
        <a
          className="btn btn--dark"
          href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin size={16} aria-hidden="true" /> Get Directions
        </a>
      </div>
    </>
  );
}
