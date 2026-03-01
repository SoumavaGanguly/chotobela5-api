export default function Invitation({ text }) {
  return (
    <div className="p-6 text-center">
      <h2 className="text-3xl mb-4">{text.invitationTitle}</h2>

      <p>📅 {text.date}</p>
      <p>⏰ {text.time}</p>

      <p className="mt-4">{text.venue}</p>

      <a
        href="https://maps.google.com/?q=SP+Joyville+Annex+Pune"
        target="_blank"
        className="text-blue-700 underline block mt-4"
      >
        Open in Google Maps
      </a>
    </div>
  );
}