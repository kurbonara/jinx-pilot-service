export default function Toast({ message }) {
  return (
    <div className={"toast" + (message ? " is-show" : "")} role="status" aria-live="polite">
      {message}
    </div>
  );
}
