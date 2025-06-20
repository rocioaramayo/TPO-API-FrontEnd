import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../store/slices/categoriesSlice';

import cercaTextura from '../assets/cerca-en-la-textura-delicada.jpg';
import carruselFoto2 from '../assets/CARRUSEL_OFICIAL_FOTO2.jpg';
import costuraManual from '../assets/costuraManual-carruse_4.jpg';
import carrusel1 from '../assets/CARRUSEL_OFICIAL_1.jpg';
import fot3carrusen from '../assets/fot-3carruseñ.jpg';
import carruselFoto52 from '../assets/CARRUSEL_OFICIAL_FOTO52.jpg';
import artesano from '../assets/artesano-trabajando.jpg';

// Categorías por defecto
const defaultCategories = [
  { nombre: 'Billeteras / Tarjeteros',  img: carruselFoto2,   key: 'billeteras' },
  { nombre: 'Estuches Airpods',        img: costuraManual,    key: 'airpods'    },
  { nombre: 'Bolsos Tech',             img: carrusel1,        key: 'bolsos'     },
  { nombre: 'Riñoneras',               img: fot3carrusen,     key: 'rinoneras'  },
  { nombre: 'Correas Apple Watch',     img: carruselFoto52,   key: 'correas'    },
  { nombre: 'Accesorios',              img: artesano,         key: 'accesorios' }
];

// Imágenes de respaldo
const placeholderImgs = [
  carruselFoto2, costuraManual, carrusel1,
  fot3carrusen, carruselFoto52, artesano
];

const CategoryGrid = ({ onCategoryClick }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: fetchedCategories, loading } = useSelector((state) => state.categories);

  useEffect(() => {
    // Evitar llamadas repetidas si ya hay categorías
    if (fetchedCategories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, fetchedCategories.length]);

  // Usar categorías del store o las de por defecto si no están disponibles
  const baseCategories = (fetchedCategories.length > 0 ? fetchedCategories : defaultCategories)
    .slice(0, 6) // Tomar solo 6
    .map(cat => ({
      ...cat,
      key: cat.id || cat.key // Usar 'id' de la API o 'key' de las de por defecto
    }));

  // Copiar y asegurar 6 elementos para el grid
  const cats = [...baseCategories];
  while (cats.length < 6) {
    cats.push({ nombre: '', img: '', key: `ph-${cats.length}` });
  }

  // Garantizar imagen válida
  const catsWithImg = cats.map((cat, i) => ({
    ...cat,
    img: cat.img || placeholderImgs[i % placeholderImgs.length]
  }));

  return (
    <section
      id="categorias"
      className="py-32 px-4"
      style={{
        backgroundImage: `linear-gradient(rgba(255,247,237,0.92), rgba(255,247,237,0.97)), url(${cercaTextura})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <span className="text-xs font-medium text-orange-800 bg-orange-50 px-4 py-2 rounded-full tracking-widest uppercase">
            CATEGORÍAS
          </span>
          <h2 className="text-4xl lg:text-5xl font-light text-orange-950 mt-4 mb-2">
            Explorá por categoría
          </h2>
          <p className="text-orange-700 text-lg font-light">
            Elegí el tipo de producto que buscás
          </p>
        </div>

        {/* Grid superior: grande izquierda y dos chicas apiladas a la derecha */}
        <div className="grid grid-cols-3 grid-rows-2 gap-8 mb-12">
          {/* Grande */}
          <Card
            data={catsWithImg[0]}
            className="col-span-2 row-span-2"
            onClick={() => handleClick(catsWithImg[0], navigate, onCategoryClick)}
          />
          {/* Pequeña arriba derecha */}
          <Card
            data={catsWithImg[1]}
            className="col-start-3 row-start-1"
            onClick={() => handleClick(catsWithImg[1], navigate, onCategoryClick)}
          />
          {/* Pequeña abajo derecha */}
          <Card
            data={catsWithImg[2]}
            className="col-start-3 row-start-2"
            onClick={() => handleClick(catsWithImg[2], navigate, onCategoryClick)}
          />
        </div>

        {/* Grid inferior invertido: dos chicas apiladas izquierda y grande derecha */}
        <div className="grid grid-cols-3 grid-rows-2 gap-8">
          {/* Pequeña arriba izquierda */}
          <Card
            data={catsWithImg[3]}
            className="col-start-1 row-start-1"
            onClick={() => handleClick(catsWithImg[3], navigate, onCategoryClick)}
          />
          {/* Pequeña abajo izquierda */}
          <Card
            data={catsWithImg[4]}
            className="col-start-1 row-start-2"
            onClick={() => handleClick(catsWithImg[4], navigate, onCategoryClick)}
          />
          {/* Grande derecha */}
          <Card
            data={catsWithImg[5]}
            className="col-start-2 col-span-2 row-span-2 row-start-1"
            onClick={() => handleClick(catsWithImg[5], navigate, onCategoryClick)}
          />
        </div>
      </div>
    </section>
  );
};

// Maneja navegación o callback
const handleClick = (cat, navigate, onCategoryClick) => {
  if (onCategoryClick) return onCategoryClick(cat);
  navigate(`/productos?categoria=${encodeURIComponent(cat.nombre)}`);
};

const Card = ({ data, className = '', onClick }) => (
  <div
    className={`relative group rounded-2xl overflow-hidden shadow-lg flex items-stretch ${className}`}
    style={{ minHeight: '220px' }}
    onClick={onClick}
  >
    <img
      src={data.img}
      alt={data.nombre}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-orange-900/70 via-transparent to-transparent" />
    <div className="absolute bottom-0 left-0 p-6">
      <h3 className="text-2xl font-bold text-white drop-shadow">
        {data.nombre || 'Categoría'}
      </h3>
      <button className="mt-2 px-4 py-1 bg-white/90 text-orange-900 rounded-full">
        Ver más
      </button>
    </div>
  </div>
);

export default CategoryGrid;
