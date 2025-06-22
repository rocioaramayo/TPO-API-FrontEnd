import Footer from '../components/Footer';
import heroImage from '../assets/alguien-conmapoa.webp'; // Usamos una imagen temática

const PoliticaPrivacidad = () => (
    <div className="bg-white text-orange-950">
        {/* Hero Section */}
        <section
            className="relative h-[40vh] bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
        >
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                <h1 className="text-5xl lg:text-6xl font-light mb-4">
                    Política de Privacidad
                </h1>
                <p className="text-lg lg:text-xl font-light max-w-2xl leading-relaxed">
                    Tu confianza y la protección de tus datos son nuestra prioridad.
                </p>
            </div>
        </section>

        {/* Content Section */}
        <main className="max-w-4xl mx-auto py-24 sm:py-32 px-4">
            <div className="prose prose-lg lg:prose-xl max-w-none text-orange-800 prose-p:font-normal prose-ul:list-disc prose-ul:marker:text-amber-800 prose-headings:text-orange-950 prose-headings:font-light prose-h2:text-4xl prose-h2:mb-6 prose-h2:mt-16 prose-h2:border-t prose-h2:pt-12 prose-h2:border-orange-200/70 prose-h3:text-2xl prose-h3:font-serif prose-h3:italic prose-h3:text-amber-900 prose-a:text-amber-800 hover:prose-a:text-amber-900 prose-strong:font-medium prose-strong:text-orange-950 first-of-type:prose-h2:mt-0 first-of-type:prose-h2:border-t-0 first-of-type:prose-h2:pt-0">

                <p className='text-sm text-orange-800/60'>Última actualización: 1 de Agosto de 2024</p>

                <h2>1. Introducción</h2>
                <p>
                    En Cuero Argentino, respetamos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política de privacidad te informará sobre cómo cuidamos tus datos personales cuando visitas nuestro sitio web (independientemente de dónde lo visites) y te informará sobre tus derechos de privacidad y cómo la ley te protege.
                </p>

                <h2>2. Qué datos recopilamos sobre ti</h2>
                <p>
                    Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales sobre ti, que hemos agrupado de la siguiente manera:
                </p>
                <ul>
                    <li><strong>Datos de Identidad:</strong> incluyen nombre, apellido, nombre de usuario o identificador similar.</li>
                    <li><strong>Datos de Contacto:</strong> incluyen dirección de facturación, dirección de entrega, dirección de correo electrónico y números de teléfono.</li>
                    <li><strong>Datos Financieros:</strong> incluyen detalles de la tarjeta de pago (procesados de forma segura por nuestros proveedores de pago).</li>
                    <li><strong>Datos de Transacción:</strong> incluyen detalles sobre los pagos hacia y desde ti y otros detalles de los productos y servicios que nos has comprado.</li>
                    <li><strong>Datos Técnicos:</strong> incluyen la dirección del protocolo de Internet (IP), tus datos de inicio de sesión, el tipo y la versión del navegador, la configuración de la zona horaria y la ubicación, etc.</li>
                </ul>

                <h2>3. Cómo se recopilan tus datos personales</h2>
                <p>
                    Utilizamos diferentes métodos para recopilar datos de y sobre ti, incluyendo a través de:
                </p>
                <ul>
                    <li><strong>Interacciones directas:</strong> Puedes darnos tu identidad, contacto y datos financieros al completar formularios o al comunicarte con nosotros por correo postal, teléfono, correo electrónico u otro medio. Esto incluye los datos personales que proporcionas cuando creas una cuenta, realizas un pedido o te suscribes a nuestro boletín informativo.</li>
                    <li><strong>Tecnologías o interacciones automatizadas:</strong> A medida que interactúas con nuestro sitio web, podemos recopilar automáticamente Datos Técnicos sobre tu equipo, acciones de navegación y patrones.</li>
                </ul>

                <h2>4. Cómo usamos tus datos personales</h2>
                <p>
                    Usaremos tus datos personales solo cuando la ley nos lo permita. Generalmente, usaremos tus datos personales en las siguientes circunstancias:
                </p>
                <ul>
                    <li>Para procesar y entregar tu pedido, incluyendo la gestión de pagos y la tramitación de envíos.</li>
                    <li>Para gestionar nuestra relación contigo, lo que incluirá notificarte sobre cambios en nuestros términos o política de privacidad.</li>
                    <li>Para administrar y proteger nuestro negocio y este sitio web (incluyendo la solución de problemas, el análisis de datos, las pruebas, el mantenimiento del sistema, el soporte, la presentación de informes y el alojamiento de datos).</li>
                    <li>Para enviarte comunicaciones de marketing, si has optado por recibirlas.</li>
                </ul>

                <h2>5. Divulgación de tus datos personales</h2>
                <p>
                    No compartiremos tus datos personales con terceros, excepto con proveedores de servicios de confianza que nos ayudan a operar nuestro negocio, como pasarelas de pago y empresas de envío, quienes están obligados a mantener la confidencialidad de tu información.
                </p>

                <h2>6. Seguridad de los datos</h2>
                <p>
                    Hemos implementado medidas de seguridad apropiadas para evitar que tus datos personales se pierdan accidentalmente, se usen o se acceda a ellos de forma no autorizada, se alteren o se divulguen.
                </p>
                
                <h2>7. Tus derechos legales</h2>
                <p>
                    Bajo ciertas circunstancias, tienes derechos bajo las leyes de protección de datos en relación con tus datos personales, incluyendo el derecho a solicitar el acceso, la corrección, la eliminación o la restricción del procesamiento de tus datos personales.
                </p>

                <h2>8. Contacto</h2>
                <p>
                    Si tienes alguna pregunta sobre esta política de privacidad, por favor contáctanos a través de nuestra página de <a href="/contacto">Contacto</a>.
                </p>
            </div>
        </main>
        <Footer />
    </div>
);

export default PoliticaPrivacidad; 