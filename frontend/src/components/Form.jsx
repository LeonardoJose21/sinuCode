import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Adjust the path as necessary
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'; // Adjust the path as necessary
import { Loader } from 'lucide-react';

const AuthForm = ({ method, route }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [nombre_completo, setNombre] = useState("");
  const [programa_academico, setCarrera] = useState("");
  const navigate = useNavigate();
  const username = email;

  const name = method === "login" ? "Iniciar Sesión" : "Registrarse";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (password !== confPassword && method === "register") {
      alert("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

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
        cantidad_ejercicios_resueltos: 0,
        nombre_completo,
        programa_academico,
        dificultad_predominante: "facil"
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
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Insttucional</label>
        <Input
          id="email"
          className="form-input block w-full p-2 border border-gray-300 rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo Electrónico"
          required
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
          required
        />
      </div>
      {method === "register" && (
        <>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
            <Input
              id="password"
              className="form-input block w-full p-2 border border-gray-300 rounded"
              type="password"
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              placeholder="Contraseña"
              required
            />
          </div>
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre completo</label>
            <Input
              id="nombre"
              className="form-input block w-full p-2 border border-gray-300 rounded"
              type="text"
              value={nombre_completo}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              required
            />
          </div>
          <div>
            <label htmlFor="carrera" className="block text-sm font-medium text-gray-700">Programa académico</label>
            <Select value={programa_academico} onValueChange={setCarrera} required>
              <SelectTrigger className="w-full p-2 border rounded bg- text-black">
                <SelectValue placeholder="Seleccione su programa académico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ingenieria de sistemas">Ingeniería de Sistemas</SelectItem>
                <SelectItem value="Ingenieria industrial">Ingeniería Industrial</SelectItem>
                <SelectItem value="Ingenieria electromecanica">Ingeniería Electromecánica</SelectItem>
                <SelectItem value="Ingenieria electrica">Ingeniería Eléctrica</SelectItem>
                <SelectItem value="Ingenieria civil">Ingeniería Civil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      {method === "login" && (
        <div className="text-sm text-gray-600">
          <p>¿No estás registrado? <a href="/register" className="text-blue-500">Regístrate aquí</a></p>
        </div>)}

      {method === "register" && (
        <div className="text-sm text-gray-600">
          <p>¿Ya tienes cuenta? <a href="/login" className="text-blue-500">Inicia sesión aquí</a></p>
        </div>
      )}

      <div className='text-center w-full'>
        {loading && <Loader className="animate-spin mx-auto" />}
      </div>
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
