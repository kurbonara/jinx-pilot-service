const FAQS = [
  [
    "How are stars counted?",
    "Epic and Legend each have 5 divisions (V to I) with 5 stars each, so Epic V to Mythic is 50 stars. From Mythic onward stars are counted straight up: Mythic 0–24, Mythical Honor 25–49, Mythical Glory 50–99, Mythical Immortal 100+.",
  ],
  [
    "What if my push crosses two brackets?",
    "Each star uses the rate of the bracket it's earned in. For example, Mythic 45★ to Glory 55★ is 5 stars at ₱55 plus 5 stars at ₱60. The calculator shows this breakdown for you.",
  ],
  [
    "What is spam pilot?",
    "A session with no fixed rank goal. The pilot plays games on your account and you pay only for the stars gained, at each bracket's rate. Set a budget to cap how far it goes.",
  ],
  [
    "Do you only play Kagura?",
    "Kagura is JINX's signature hero and the standard rates are for Kagura games. If you're fine with the pilot using any hero, every rate is ₱10 cheaper per star (₱40 / ₱45 / ₱50 / ₱55). Pick \"Any hero\" in the calculator to see the discounted total.",
  ],
  [
    "Are stars lost during the session charged?",
    "No. You're charged for net stars gained from your starting rank to the finished rank.",
  ],
];

export default function Faq() {
  return (
    <section className="section" id="faq">
      <div className="wrap wrap-narrow">
        <div className="section-head">
          <p className="kicker">FAQ</p>
          <h2>Questions before you book</h2>
        </div>
        <div className="faq">
          {FAQS.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
