
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ACCESS_TOKEN } from "../constants";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SolicitarMonitoriaForm() {
  const [tema, setTema] = useState("");
  const [modalidad, setModalidad] = useState("Presencial");
  const [fecha, setFecha] = useState("");
  const [monitores, setMonitores] = useState(null);
  const [monitorId, setMonitorId] = useState("");
  const [hora, setHora] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "playground/api/monitor/")
      .then((response) => {
        setMonitores(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching monitores", error);
      }).finally(() =>
        setLoading(false))
      ;
  }, []);

  const handleSubmit = async () => {

    if (!fecha || !hora) {
      alert("Por favor, ingrese la fecha y la hora.");
      return;
    }
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "playground/api/solicitar-monitoria/",
        {
          tema,
          modalidad,
          monitor_id: monitorId,
          fecha: fecha,
          hora: hora
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Solicitud enviada correctamente.");
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      alert("Error al enviar la solicitud.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-2xl shadow-md border space-y-4 bg-white">
      <h2 className="text-xl font-bold text-slate-900">Solicitar Monitoría</h2>
      <p className="text-xs">Para hacer la solicitud ingresar el tema (opcional), la modalidad (opcional),
        la fecha y la hora (ambas obligatorias)</p>

      <Input
        placeholder="Tema de la monitoría"
        value={tema}
        onChange={(e) => setTema(e.target.value)}
        required
      />

      <Select value={modalidad} onValueChange={setModalidad}>
        <SelectTrigger className="bg-white text-black">
          <SelectValue placeholder="Select a Escoja la modalida" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="presencial">Presencial</SelectItem>
          <SelectItem value="virtual">Virtual</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <Input
        type="time"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
      />

      <Select value={monitorId} onValueChange={setMonitorId} required>
        <SelectTrigger className="bg-white text-black">
          <SelectValue placeholder="Seleccione un monitor" />
        </SelectTrigger>
        <SelectContent>
          {loading ? (
            <SelectItem disabled value="cargando">
              Cargando monitores...
            </SelectItem>
          ) : monitores.length > 0 ? (
            monitores.map((monitor) => (
              <SelectItem key={monitor.id} value={monitor.id.toString()}>
                {monitor.nombre_completo}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled value="sin-monitores">
              No hay monitores disponibles
            </SelectItem>
          )}
        </SelectContent>
      </Select>


      <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">
        Enviar Solicitud
      </Button>
    </div>
  );
}
