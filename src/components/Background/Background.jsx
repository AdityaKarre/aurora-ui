export default function Background() {
  return (
    <div
      className="background"
      aria-hidden="true"
    >
      <div className="background-orb background-orb-primary" />
      <div className="background-orb background-orb-secondary" />

      <div className="background-noise" />
      <div className="background-vignette" />
    </div>
  );
}