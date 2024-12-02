import { useState } from 'react';

const useNewPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const changePassword = async (password, token) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:3003/api/command/newPass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }), // Enviamos la contraseña y el token
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Contraseña cambiada con éxito');
      } else {
        setError(data.message || 'Error al cambiar la contraseña');
      }
    } catch (error) {
      setError('Hubo un error en la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, error, success };
};

export default useNewPassword;
