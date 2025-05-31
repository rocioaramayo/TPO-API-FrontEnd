import { useEffect, useState } from "react";

const GestionComprasAdmin = ({ user }) => {
    const [compras, setCompras] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/compras", {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener compras");
                return res.json();
            })
            .then(setCompras)
            .catch((err) => setError(err.message));
    }, [user]);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Todas las Compras</h2>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-4">
                {compras.map((compra) => (
                    <li key={compra.id} className="border p-4 rounded shadow-sm bg-white">
                        <p><strong>ID Compra:</strong> {compra.id}</p>
                        <p><strong>Fecha:</strong> {compra.fecha}</p>
                        <p><strong>Total:</strong> ${compra.total}</p>
                        <p><strong>Método de Pago:</strong> {compra.metodoDePago} {compra.cuotas && `(cuotas: ${compra.cuotas})`}</p>
                        <p><strong>Entrega:</strong> {compra.metodoEntrega || compra.puntoRetiro || "A domicilio"}</p>
                        <ul className="pl-4 mt-2 list-disc">
                            {compra.items.map((item, idx) => (
                                <li key={idx}>
                                    {item.nombreProducto} x{item.cantidad} - ${item.precioUnitario} c/u
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GestionComprasAdmin;
