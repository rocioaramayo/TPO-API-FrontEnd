import React, { useState } from 'react';

const DoubleConfirmModal = ({ open, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState('');

  if (!open) return null;

  const handleFirstConfirm = () => setStep(2);
  const handleFinalConfirm = () => {
    if (input === 'ELIMINAR') {
      onConfirm();
      setStep(1);
      setInput('');
      onClose();
    }
  };
  const handleClose = () => {
    setStep(1);
    setInput('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {step === 1 && (
          <>
            <h2>¿Estás seguro?</h2>
            <p>Esta acción no se puede deshacer.</p>
            <button onClick={handleFirstConfirm}>Continuar</button>
            <button onClick={handleClose}>Cancelar</button>
          </>
        )}
        {step === 2 && (
          <>
            <h2>Confirmación final</h2>
            <p>Escribe <b>ELIMINAR</b> para confirmar.</p>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            <button
              onClick={handleFinalConfirm}
              disabled={input !== 'ELIMINAR'}
            >Eliminar</button>
            <button onClick={handleClose}>Cancelar</button>
          </>
        )}
      </div>
    </div>
  );
};

export default DoubleConfirmModal; 