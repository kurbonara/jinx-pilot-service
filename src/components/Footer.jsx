export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p>© {new Date().getFullYear()} JINX Pilot Service</p>
        <p className="tiny muted">
          Independent service. Not affiliated with or endorsed by Moonton or Mobile Legends: Bang Bang.
        </p>
      </div>
    </footer>
  );
}
