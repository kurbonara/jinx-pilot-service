const STEPS = [
  ["Get your quote", "Use the calculator and copy your order details."],
  ["Message JINX on TikTok", "Send the details or PNG. The pilot confirms the price and schedule."],
  ["Pay & hand over", "Send payment, then share login details privately."],
  ["Watch the climb", "Get progress updates until your goal (or star count) is reached."],
];

export default function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">How it works</p>
          <h2>Four steps to your new rank</h2>
        </div>
        <ol className="steps">
          {STEPS.map(([title, text], i) => (
            <li key={title}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
