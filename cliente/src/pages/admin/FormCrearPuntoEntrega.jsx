import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FormCrearPuntoEntrega = ({ user }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [punto, setPunto] = useState({
        nombre:"",
        descripcion:"",
        direccion:"",
        localidad:"",
        provincia:"",
        codigoPostal:"",
        horarioAtencion:"",
        telefono:"",
        email:"",
        metodoEntregaId:"",
    });
}

export default FormCrearPuntoEntrega;