export default function Stepper({ id, value, min, max, onStep, onInput, onBlur, label = "value", placeholder }) {
  return (
    <div className="stepper">
      <button type="button" aria-label={`Minus one ${label}`} onClick={() => onStep(-1)}>
        −
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onInput(e.target.value)}
        onBlur={onBlur}
      />
      <button type="button" aria-label={`Plus one ${label}`} onClick={() => onStep(1)}>
        +
      </button>
    </div>
  );
}
