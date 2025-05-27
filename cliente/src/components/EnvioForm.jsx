import { useState } from "react";

const zonasEnvio = [
    { id: "local", name: "Local" },
    { id: "nacional", name: "Nacional" },
    { id: "internacional", name: "Internacional" },
];

export default function EnvioForm({ productPrice }) {
    const [selectedZona, setSelectedZona] = useState("");
    const [shippingCost, setShippingCost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = async (e) => {
        const zona = e.target.value;
        setSelectedZona(zona);
        setShippingCost(null);
        setError(null);

        if (!zona) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/envio?zona=${zona}`);
            if (!response.ok) throw new Error("Error al calcular envío");
            const data = await response.json();
            setShippingCost(data.costo);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const totalPrice = productPrice + (shippingCost || 0);

    return (
        <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                Seleccioná la zona de envío:
            </label>
            <select
                value={selectedZona}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            >
                <option value="">Seleccioná una zona</option>
                {zonasEnvio.map((zona) => (
                    <option key={zona.id} value={zona.id}>
                        {zona.name}
                    </option>
                ))}
            </select>

            {loading && <p>Cargando costo de envío...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {shippingCost !== null && !loading && !error && (
                <div>
                    <p className="text-gray-700">Costo de envío: ${shippingCost}</p>
                    <p className="font-bold text-lg text-gray-900">Total: ${totalPrice}</p>
                </div>
            )}
        </div>
    );
}
