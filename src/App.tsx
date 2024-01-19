import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    consultorio: '',
    doctor: '',
    inicioConsulta: '',
    nombrePaciente: '',
  });

  const [doctors, setDoctors] = useState([]);
  const [consultorios, setConsultorios] = useState([]);
  const [table, setTable] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const doctorApiUrl = 'http://localhost:5000/api/doctores';
      const consultorioApiUrl = 'http://localhost:5000/api/consultorios';
      const tablaData = 'http://localhost:5000/api/citas';

      try {
        const doctorsResponse = await fetch(doctorApiUrl);
        const consultoriosResponse = await fetch(consultorioApiUrl);
        const tableDataReponse = await fetch(tablaData);

        const doctorsData = await doctorsResponse.json();
        const consultoriosData = await consultoriosResponse.json();
        const tableDataReponseData = await tableDataReponse.json();
        console.log(tableDataReponseData);

        setDoctors(doctorsData);
        setConsultorios(consultoriosData);
        setTable(tableDataReponseData)
      } catch (error) {
        console.error('Error fetching dummy data:', error);
      }
    };

    fetchData();
  }, [doctors]);

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log('OK');
      } else {
        console.error('error:', response.status);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <>
    <div className="appointment-form-container">
      <h1>Genera tu cita</h1>
      <form onSubmit={handleSubmit} className="appointment-form">
        <label>
          Consultorio:
          <select
            name="consultorio"
            value={formData.consultorio}
            onChange={handleChange}
          >
            <option value="" disabled>Selecciona un Consultorio</option>
            {consultorios.map((consultorio:any) => (
              <option key={consultorio.id} value={consultorio.id}>
                {consultorio.numeroDeConsultorio}
              </option>
            ))}
          </select>
        </label>

        <label>
          Doctor:
          <select
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
          >
            <option value="" disabled>Selecciona un doctor</option>
            {doctors.map((doctor:any) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Inicio de Consulta:
          <input
            type="datetime-local"
            name="inicioConsulta"
            value={formData.inicioConsulta}
            onChange={handleChange}
          />
        </label>

        <label>
          Nombre del Paciente:
          <input
            type="text"
            name="nombrePaciente"
            value={formData.nombrePaciente}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Generar Cita</button>
      </form>
    </div>
    <div className="table-container">
      <h2>Citas </h2>
      <table className="data-table">
        <thead>
          <tr>
            <th className="table-header">Id Cita</th>
            <th className="table-header">Fecha Inicio</th>
            <th className="table-header">Nombre Paciente</th>
            <th className="table-header">Número de Consultorio</th>
            <th className="table-header">Doctor</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row:any, index) => (
            <tr key={index} className="table-row">
              <td className="table-cell">{row.id}</td>
              <td className="table-cell">{row.fechaInicio}</td>
              <td className="table-cell">{row.nombrePaciente}</td>
              <td className="table-cell">{row.consultorio.numeroDeConsultorio}</td>
              <td className="table-cell">{row.doctor.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
   </>
  );
};

export default App
