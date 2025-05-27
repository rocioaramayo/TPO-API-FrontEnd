import Footer from '../components/Footer';

const PoliticaPrivacidad = () => (
  <div className="min-h-screen bg-cream-50 flex flex-col justify-between">
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-serif font-bold text-leather-900 mb-6 text-center">Política de Privacidad</h1>
      <div className="bg-white p-8 rounded-lg shadow-md text-leather-700 space-y-4">
        <p>Este es un texto de ejemplo para la Política de Privacidad. Aquí deberías explicar cómo se recopilan, usan y protegen los datos de los usuarios.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam nunc, eget aliquam massa nisi nec erat.</p>
        <p>Recuerda adaptar este texto según las necesidades de tu emprendimiento y la normativa vigente.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default PoliticaPrivacidad; 