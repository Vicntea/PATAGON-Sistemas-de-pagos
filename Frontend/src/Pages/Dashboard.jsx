import React, { useState, useEffect } from 'react';
import MenuDashboard from '../../public/Components/menuDashboard/menuDashboard';
import Card from '../../public/Components/Tarjeta/Card.jsx';
import styles1 from '../styles/DashboardGeneral.module.css'; // Para Menu
import styles from '../styles/Dashboard.module.css'; // Para Bolsas
import Notifications from './Notifications.jsx';
import Notification_dashboard from '../../public/Components/notificaciones/notificaciones_dashboard.jsx';
import logo from '../assets/SoloLogo_Patagon.png';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bolsas, setBolsas] = useState([]); // Estado para almacenar las bolsas
  const ipserver = import.meta.env.VITE_IP;
  const port = import.meta.env.VITE_PORT;

  
  useEffect(() => {
    const fetchBolsas = async () => {
      const token = localStorage.getItem('token'); // Obtén el token almacenado
  
      try {
        const response = await fetch(`http://${ipserver}:${port}/api/bolsas`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Envía el token en los headers
          }
        });
  
        if (!response.ok) {
          throw new Error('Error en la red al obtener las bolsas'); // Manejo de errores
        }
  
        const data = await response.json(); // Convierte la respuesta a JSON
        setBolsas(data); // Actualiza el estado con las bolsas
      } catch (error) {
        console.error('Error al obtener las bolsas:', error);
      }
    };
  
    fetchBolsas(); // Llama a la función para obtener las bolsas
  }, []);
  

  return (
    <div className={styles1.dashboardContainer}>
      <MenuDashboard toggleMenu={() => { setIsOpen(!isOpen) }} isOpen={isOpen} />

      <main className={`${styles1.content} ${isOpen ? styles1.open : ''}`}>
      <div className={styles1.header}>
        <div className={styles1.titleLogo}>
          <img src={logo} className={styles1.menuIcon}/>
          <h1>Dashboard</h1>
        </div>
        <Notification_dashboard />
      </div>


        <div className={styles.dashboardWidgets}>
          { (
            bolsas.map((bolsa, index) => ( // Itera sobre las bolsas obtenidas y muestra una Card para cada una
              <Card
                key={index} // Asegúrate de usar un key único
                nombre={bolsa.nombre}
                tiempo={bolsa.tiempo}
                precio={bolsa.precio}
                detalles={bolsa.detalles} // Pasamos el arreglo de detalles
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
