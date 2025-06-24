import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMetodoEntrega } from '../../store/slices/metodoEntregaSlice';

const FormCrearMetodoEntrega = ({ user, setMostrarCrearMetodo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [metodo, setMetodo] = useState({
    nombre: "",
    descripcion: "",
    costoBase: "",
    tiempoEstimadoDias: "",
    requiereDireccion: "",
    requierePuntoRetiro: "",
    activo: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetodo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCrearMetodo = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!user?.token || user.token.split('.').length !== 3) {
      alert("Token inválido o no disponible. Iniciá sesión de nuevo.");
      return;
    }

    fetch('http://127.0.0.1:8080/entregas/metodos', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify(metodo)
    })
      .then(response => {
        return response.text().then(text => {
          let data = {};
          try { data = JSON.parse(text); } catch (e) { data = { message: text }; }
          if (!response.ok) {
            let errorMessage = 'Error al crear método de entrega';
            switch (response.status) {
              case 404:
                errorMessage = 'No encontrado';
                break;
              case 400:
                errorMessage = 'Datos del método de entrega inválidos';
                break;
              case 403:
                errorMessage = 'No tienes permisos para crear métodos';
                break;
              default:
                if (data.message) errorMessage = data.message;
                else if (response.statusText && response.statusText !== 'OK') errorMessage = response.statusText;
            }
            throw new Error(errorMessage);
          }
          return data;
        });
      })
      .then(data => {
        console.log('Método creado con éxito:', data);
        setSuccess(true);
        setError(null);
        dispatch(fetchMetodoEntrega()); // 👈 ACTUALIZA REDUX
        setMetodo({
          nombre: "",
          descripcion: "",
          costoBase: "",
          tiempoEstimadoDias: "",
          requiereDireccion: "",
          requierePuntoRetiro: "",
          activo: true
        });
        setTimeout(() => {
          setMostrarCrearMetodo(false)
        }, 3000);
      })
      .catch(error => {
        console.error('Error al crear método:', error);
        setError(error.message);
        setSuccess(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {/* ... todo tu JSX queda igual ... */}
    </>
  )
}

export default FormCrearMetodoEntrega;
