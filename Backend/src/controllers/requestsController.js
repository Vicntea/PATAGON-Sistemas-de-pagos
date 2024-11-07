import { pool } from "../middleware/authenticateDB.js";
import Resquests from '../models/requests.js';


export async function requests(req, res) {
  try {
    const requests = await Resquests.findAll({
      attributes: ['ID_request', 'nombre', 'email', 'institucion', 'estado', 'fecha'],
      order: [['fecha', 'ASC']],
    });

     // Formatear la fecha a 'YYYY-MM-DD'
     const formattedRequests = requests.map(request => {
      const fecha = request.fecha.toISOString().split('T')[0]; 
      return {
        ...request.toJSON(), 
        fecha, 
      };
    });

    res.status(200).json(formattedRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al obtener las solicitudes' });
  }
}




export async function addRequest(req, res) {
  const { name, email, institution } = req.body; // Cambia institucion a institution

  // Asegúrate de que los nombres coincidan con los que usaste en el formulario
  const documento_pdf = req.files && req.files['upload-application']
    ? req.files['upload-application'][0].buffer
    : null;
  const documento_pub = req.files && req.files['upload-public-key']
    ? req.files['upload-public-key'][0].buffer
    : null;

  if (!documento_pdf || !documento_pub) {
    return res.status(400).json({ error: 'Faltan archivos PDF o PUB' });
  }

  // Verifica si los archivos PDF y PUB están presentes
  if (!documento_pdf || !documento_pub) {
    return res.status(400).json({ error: 'Faltan archivos PDF o PUB' });
  }

  try {
  
    const requestDate = new Date();

    // Crea la nueva solicitud
    const newRequest = await Resquests.create({
      nombre: name,
      email,
      institucion: institution,
      documento_pdf,
      documento_pub,
      user_id: null, 
      estado: 'pendiente',
      fecha: requestDate,
    });

    // Emite el evento para notificar la nueva solicitud
    req.app.get('io').emit('newRequest', newRequest);
    res.status(201).json(newRequest);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error al guardar la solicitud' });
  }
}

