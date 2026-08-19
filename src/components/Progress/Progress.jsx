export default function Progress({ current, total }) {
  return (
    <div className="progress">
      {current + 1} / {total}
    </div>
  );
}