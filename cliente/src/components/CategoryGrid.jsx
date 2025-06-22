import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../store/slices/categoriesSlice';

import carruselFoto2 from '../assets/CARRUSEL_OFICIAL_FOTO2.jpg';
import costuraManual from '../assets/costuraManual-carruse_4.jpg';
import carrusel1 from '../assets/CARRUSEL_OFICIAL_1.jpg';
import fot3carrusen from '../assets/fot-3carruseñ.jpg';
import carruselFoto52 from '../assets/CARRUSEL_OFICIAL_FOTO52.jpg';
import artesano from '../assets/artesano-trabajando.jpg';

// Categorías por defecto - minimalista
const defaultCategories = [
  { nombre: 'Billeteras', img: carruselFoto2, key: 'billeteras' },
  { nombre: 'Bolsos', img: carrusel1, key: 'bolsos' },
  { nombre: 'Accesorios', img: artesano, key: 'accesorios' },
  { nombre: 'Correas', img: carruselFoto52, key: 'correas' }
];

// Imágenes de respaldo
const placeholderImgs = [carruselFoto2, carrusel1, artesano, carruselFoto52];

const CategoryGrid = ({ onCategoryClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: fetchedCategories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    if (fetchedCategories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, fetchedCategories.length]);

  // Solo 4 categorías para el diseño minimalista
  const baseCategories = (fetchedCategories.length > 0 ? fetchedCategories : defaultCategories)
    .slice(0, 4)
    .map(cat => ({
      ...cat,
      key: cat.id || cat.key
    }));

  // Garantizar imagen válida
  const catsWithImg = baseCategories.map((cat, i) => ({
    ...cat,
    img: cat.img || placeholderImgs[i % placeholderImgs.length]
  }));

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Header minimalista */}
        <div className="text-center mb-20">
          <h2 className="text-[#2C1810] text-4xl font-light mb-6">
            Explora por Categoría
          </h2>
          <div className="w-16 h-px bg-[#8B7355] mx-auto"></div>
        </div>

        {/* Grid simple y elegante */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {catsWithImg.map((cat) => (
            <div
              key={cat.key}
              className="group cursor-pointer"
              onClick={() => navigate(`/productos?categoria=${encodeURIComponent(cat.nombre)}`)}
            >
              {/* Imagen simple */}
              <div className="relative overflow-hidden aspect-[4/5] mb-6">
                <img
                  src={cat.img}
                  alt={cat.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay sutil */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              
              {/* Texto minimalista */}
              <div className="text-center space-y-2">
                <h3 className="text-[#2C1810] text-lg font-light tracking-wide group-hover:text-[#8B7355] transition-colors duration-300">
                  {cat.nombre}
                </h3>
                <div className="text-[#8B7355] text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Ver colección
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA opcional */}
        <div className="text-center mt-16">
          <button 
            onClick={() => navigate('/productos')}
            className="text-[#8B7355] hover:text-[#2C1810] font-light tracking-[0.2em] border-b border-[#8B7355] hover:border-[#2C1810] pb-1 transition-colors duration-300"
          >
            VER TODOS LOS PRODUCTOS
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;