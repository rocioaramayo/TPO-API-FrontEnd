import { useState } from 'react';

function EnvioForm() {
    const [pais, setPais] = useState('');
    const [provincia, setProvincia] = useState('');
    const [zona, setZona] = useState('');
    const [costo, setCosto] = useState(null);

    const determinarZona = (pais, provincia) => {
        if (pais.toLowerCase() !== 'argentina') return 'internacional';
        if (provincia.toLowerCase() === 'buenos aires') return 'local';
        return 'nacional';
    };

    const calcularEnvio = async () => {
        const z = determinarZona(pais, provincia);
        setZona(z);
        try {
            const res = await fetch(`http://localhost:8080/api/envio?zona=${z}`);
            const data = await res.json();
            setCosto(data.costo);
        } catch (err) {
            console.error('Error al obtener el envío', err);
        }
    };

    return (
        <div>
            <h3>Datos de envío</h3>
            <input
                type="text"
                placeholder="País"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
            />
            <input
                type="text"
                placeholder="Provincia"
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
            />
            <button onClick={calcularEnvio}>Calcular envío</button>

            {costo !== null && (
                <p>
                    Zona: <strong>{zona}</strong> <br />
                    Costo de envío: <strong>${costo}</strong>
                </p>
            )}
        </div>
    );
}

export default EnvioForm;
