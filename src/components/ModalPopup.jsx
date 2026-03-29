export default function ModalPopup({ popup, onClose }) {
  if (!popup) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h3>{popup.title}</h3>
        <p>{popup.body}</p>
        <button onClick={onClose}>Continue</button>
      </div>
    </div>
  );
}
