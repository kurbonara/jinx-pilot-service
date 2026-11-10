import { WhyIcons } from "./Icons.jsx";

const ITEMS = [
  ["shield", "No cheats, no scripts", "Pure hand-played games. Your account stays clean."],
  ["lock", "Account privacy", "No chats, no purchases, no changes to your settings or items."],
  ["clock", "Progress updates", "Know where you are on the ladder while the pilot plays."],
];

export default function WhyUs() {
  return (
    <section className="section section-tight">
      <div className="wrap why">
        {ITEMS.map(([icon, title, text]) => (
          <div className="why-item" key={title}>
            {WhyIcons[icon]}
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
