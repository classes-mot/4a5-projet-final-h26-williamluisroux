import ReactDOM from 'react-dom';
import './Modal.css';

export default function Modal({ children, onClose }) {
  const content = (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="modal-overlay">
      <button className="close-btn" onClick={onClose}>x</button>
        {children}
      </div>
    </>
  );
  return ReactDOM.createPortal(content, document.getElementById('modal-root'));
}