import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Adjust the path as necessary
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'; // Adjust the path as necessary
import LoadingIndicator from '@/components/LoadingIndicator'; // Adjust the path as necessary

const AuthForm = ({ method, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState("");
  const [sexo, setSexo] = useState("M");
  const [carrera, setCarrera] = useState("");
  const navigate = useNavigate();
  const username = email;

  const name = method === "login" ? "Iniciar Sesión" : "Registrarse";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

   
    let payload;
    if (method === "login") {
      payload = {
        username,
        email,
        password,
      };
    } else {  // Assuming method === "register"
      payload = {
        user: {
          username,
          email,
          password,
        },
        nivel_actual: 1,
        nombre,
        sexo,
        carrera,
      };
    }
    // console.log("Payload:", payload);
    try {

      const res = await api.post(route, payload);
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container space-y-4 p-4 bg-white rounded shadow-md">
      <h1 className="text-xl font-bold">{name}</h1>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <Input
          id="email"
          className="form-input block w-full p-2 border border-gray-300 rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo Electrónico"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
        <Input
          id="password"
          className="form-input block w-full p-2 border border-gray-300 rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
      </div>
      {method === "register" && (
        <>
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
            <Input
              id="nombre"
              className="form-input block w-full p-2 border border-gray-300 rounded"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
            />
          </div>
          <div>
            <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">Sexo</label>
            <select
              id="sexo"
              className="form-input block w-full p-2 border border-gray-300 rounded"
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div>
            <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Carrera</label>
            <Input
              id="carrera"
              className="form-input block w-full p-2 border border-gray-300 rounded"
              type="text"
              value={carrera}
              onChange={(e) => setCarrera(e.target.value)}
              placeholder="Carrera"
            />
          </div>
        </>
      )}
      {loading && <LoadingIndicator />}
      <Button
        className="form-button w-full p-2"
        type="submit"
        disabled={loading}
      >
        {name}
      </Button>
    </form>
  );
};

export default AuthForm;
