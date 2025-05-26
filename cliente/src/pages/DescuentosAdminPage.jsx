import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DescuentosAdminPage = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4"></div>
  );
};

export default DescuentosAdminPage; 