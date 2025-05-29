import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TablaProductos({}) {
  const navigate = useNavigate()
  const [productos,setProductos] = useState([]);
  useEffect(() => {
      fetch("http://localhost:8080/productos")
          .then((res) => res.json())
          .then((data) => {
          setProductos(data.productos);
          });
  }, []);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Cambiá este número si querés mostrar más/menos por página

    // Calcular los productos visibles
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProductos = productos?.slice(startIndex, endIndex);
    // Calcular el total de páginas
    const totalPages = Math.ceil(productos.length / itemsPerPage);
    const handleEdit = (e) => {
      e.preventDefault();
      navigate(`/admin/productos/editar/${e.target.value}`)
    }
  return (
    <>
        <div className="overflow-x-auto shadow-cognac rounded-lg border border-leather-200">
        <table className="min-w-full divide-y divide-leather-200 text-sm text-gray-700">
            <thead className="bg-leather-100 text-left text-cognac-700 font-semibold">
            <tr>
                <th></th>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Activo</th>
                <th className="px-4 py-3">Color</th>
                <th className="px-4 py-3">Descripción</th>
                <th className="px-4 py-3">Grosor</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Textura</th>
                <th className="px-4 py-3">Tipo de Cuero</th>
                <th className="px-4 py-3">Categoría</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-leather-100">
            {currentProductos.map((prod) => (
                <tr key={prod.id} className="hover:bg-leather-50 transition">
                <td className="px-4 py-3">
                    <button className="px-1" value={prod.id} onClick={handleEdit}>✏️</button>
                    <button className="px-1" value={prod.id}>🗑️</button>
                    <button className="px-1" value={prod.id}>📦➕</button>
                </td>
                <td className="px-4 py-3">{prod.id}</td>
                <td className="px-4 py-3">{prod.nombre}</td>
                <td className="px-4 py-3">
                    <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        prod.activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                    {prod.activo ? "Sí" : "No"}
                    </span>
                </td>
                <td className="px-4 py-3">{prod.color}</td>
                <td className="px-4 py-3">{prod.descripcion.length > 25 ? prod.descripcion.slice(0,25)+"..." : prod.descripcion}</td>
                <td className="px-4 py-3">{prod.grosor}</td>
                <td className="px-4 py-3">{prod.precio}</td>
                <td className="px-4 py-3">{prod.stock}</td>
                <td className="px-4 py-3">{prod.textura}</td>
                <td className="px-4 py-3">{prod.tipoCuero}</td>
                <td className="px-4 py-3">{prod.categoria}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        <div className="flex justify-center mt-4 gap-2">
            <button
                className="btn-outline-leather"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                ← Anterior
            </button>
            <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
            </span>
            <button
                className="btn-outline-leather"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
            >
                Siguiente →
            </button>
        </div>
    </>
  );
}