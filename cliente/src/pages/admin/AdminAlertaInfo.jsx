import { useEffect, useState } from 'react';

const colores = {
  success: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    )
  },
  error: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    )
  },
  info: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    icon: (
      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m0-4h.01" />
      </svg>
    )
  },
};

const AdminAlertaInfo = ({ tipo = 'info', mensaje, onClose, autoClose = true, duracion = 3500 }) => {
  const [visible, setVisible] = useState(true);
  const style = colores[tipo] || colores.info;

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duracion);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duracion, onClose]);

  if (!visible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-md shadow-lg border ${style.bg} ${style.text} ${style.border} flex items-center transition-all duration-300 animate-fadeIn`}>
      {style.icon}
      <span className="text-sm">{mensaje}</span>
      <button onClick={() => { setVisible(false); onClose?.(); }} className="ml-3 text-xs text-gray-400 hover:text-gray-600">✕</button>
    </div>
  );
};

export default AdminAlertaInfo;
