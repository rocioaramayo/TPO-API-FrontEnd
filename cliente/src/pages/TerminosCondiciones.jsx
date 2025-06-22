import Footer from '../components/Footer';
import heroImage from '../assets/cuero-fondo.jpg'; 

const TerminosCondiciones = () => (
    <div className="bg-white text-orange-950">
    {/* Hero Section */}
    <section 
      className="relative h-[40vh] bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-5xl lg:text-6xl font-light mb-4">
          Términos y Condiciones
        </h1>
        <p className="text-lg lg:text-xl font-light max-w-2xl leading-relaxed">
          Normas de uso de nuestro sitio y servicios.
        </p>
      </div>
    </section>

    {/* Content Section */}
    <main className="max-w-4xl mx-auto py-24 sm:py-32 px-4">
      <div className="prose prose-lg lg:prose-xl max-w-none text-orange-800 prose-p:font-normal prose-headings:text-orange-950 prose-headings:font-light prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-16 prose-h2:border-t prose-h2:pt-12 prose-h2:border-orange-200/70 prose-h3:text-2xl prose-h3:font-serif prose-h3:italic prose-h3:text-amber-900 prose-a:text-amber-800 hover:prose-a:text-amber-900 prose-strong:font-medium prose-strong:text-orange-950 first-of-type:prose-h2:mt-0 first-of-type:prose-h2:border-t-0 first-of-type:prose-h2:pt-0">
        
        <p className='text-sm text-orange-800/60'>Última actualización: 1 de Agosto de 2024</p>

        <h2>1. Aceptación de los Términos</h2>
        <p>
          Bienvenido a Cuero Argentino ("nosotros", "nuestro"). Al acceder y utilizar nuestro sitio web (el "Sitio") y los servicios ofrecidos, usted ("Usuario", "cliente") acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no está de acuerdo con estos términos, no debe utilizar el Sitio.
        </p>

        <h2>2. Uso del Sitio</h2>
        <p>
          El contenido y los productos de este Sitio están destinados únicamente para uso personal y no comercial. Se le concede una licencia limitada para acceder y hacer uso personal del Sitio, pero no para descargar (excepto el almacenamiento en caché de páginas) o modificarlo, o cualquier porción de él, sin nuestro consentimiento expreso por escrito.
        </p>

        <h3>Cuentas de Usuario</h3>
        <p>
          Para realizar una compra, es posible que deba crear una cuenta. Usted es responsable de mantener la confidencialidad de su cuenta y contraseña y de restringir el acceso a su computadora. Acepta la responsabilidad de todas las actividades que ocurran bajo su cuenta o contraseña.
        </p>
        
        <h2>3. Productos y Precios</h2>
        <p>
          Hacemos todo lo posible para mostrar con la mayor precisión posible los colores y las imágenes de nuestros productos. No podemos garantizar que la visualización de cualquier color en el monitor de su computadora sea precisa.
        </p>
        <p>
          Los precios de nuestros productos están sujetos a cambios sin previo aviso. Nos reservamos el derecho de modificar o descontinuar un producto en cualquier momento. Todos los precios se expresan en Pesos Argentinos (ARS) e incluyen los impuestos aplicables, a menos que se indique lo contrario.
        </p>
        
        <h2>4. Proceso de Compra y Pago</h2>
        <p>
          Al realizar un pedido, usted se compromete a proporcionar información de compra y de cuenta actual, completa y precisa. El pago se procesará a través de las pasarelas de pago disponibles en nuestro Sitio. La confirmación del pedido se enviará por correo electrónico una vez que el pago haya sido verificado.
        </p>

        <h2>5. Envíos y Entregas</h2>
        <p>
          Nuestra política de envíos, incluyendo costos y tiempos de entrega, se detalla en nuestra página de <a href="/preguntas-frecuentes">Preguntas Frecuentes</a>. No nos hacemos responsables de los retrasos causados por el proveedor de servicios de envío.
        </p>

        <h2>6. Política de Devoluciones y Garantía</h2>
        <p>
          Nuestros productos están respaldados por una garantía. Para obtener detalles sobre devoluciones, cambios y reclamaciones de garantía, por favor consulte nuestra página de <a href="/garantia">Garantía</a>.
        </p>

        <h2>7. Propiedad Intelectual</h2>
        <p>
          Todo el contenido incluido en este Sitio, como texto, gráficos, logotipos, imágenes y software, es propiedad de Cuero Argentino o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual de Argentina e internacionales.
        </p>

        <h2>8. Limitación de Responsabilidad</h2>
        <p>
          En ningún caso Cuero Argentino será responsable por daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar nuestro sitio o productos.
        </p>

        <h2>9. Modificaciones a los Términos</h2>
        <p>
          Nos reservamos el derecho de actualizar, cambiar o reemplazar cualquier parte de estos Términos y Condiciones mediante la publicación de actualizaciones y/o cambios en nuestro sitio web. Es su responsabilidad revisar esta página periódicamente para ver los cambios.
        </p>

        <h2>10. Ley Aplicable</h2>
        <p>
          Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes de la República Argentina, sin tener en cuenta su conflicto de disposiciones legales.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default TerminosCondiciones; 