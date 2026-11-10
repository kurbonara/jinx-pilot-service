import { useCallback, useRef, useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Rates from "./components/Rates.jsx";
import Calculator from "./components/Calculator.jsx";
import HowItWorks from "./components/HowItWorks.jsx";
import WhyUs from "./components/WhyUs.jsx";
import Faq from "./components/Faq.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import Toast from "./components/Toast.jsx";
import { useReveal } from "./hooks/useReveal.js";

export default function App() {
  const [toast, setToast] = useState("");
  const timer = useRef();
  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2400);
  }, []);

  useReveal(".rate-card, .steps li, .why-item, .faq details, .contact");

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Rates />
        <Calculator onToast={showToast} />
        <HowItWorks />
        <WhyUs />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Toast message={toast} />
    </>
  );
}
