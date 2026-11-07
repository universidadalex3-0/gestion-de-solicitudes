import { useCallback, useEffect, useRef, useState } from 'react';
import { SolicitudesAPI, type Formulario, type Solicitud, type Resumen } from '../services/SolicitudesAPI';
import { mensajeError } from '../../../Shared/http';
export function useSolicitudes() {
 const [estado, setEstado] = useState('');
 const [lista, setLista] = useState<Solicitud[]>([]);
 const [resumen, setResumen] = useState<Resumen | null>(null);
 const [cargando, setCargando] = useState(true);
 const [guardando, setGuardando] = useState(false);
 const [error, setError] = useState('');
 const [mensaje, setMensaje] = useState('');
 const peticion = useRef<AbortController | null>(null);
 const cargar = useCallback(async () => {
  peticion.current?.abort();
  const control = new AbortController(); peticion.current = control;
  setCargando(true); setError('');
  try {
   const [datos, totales] = await Promise.all([SolicitudesAPI.listar(estado, control.signal), SolicitudesAPI.resumen(control.signal)]);
   if (!control.signal.aborted) {setLista(datos); setResumen(totales);}
  } catch (e) {if (!control.signal.aborted) {setError(mensajeError(e)); setLista([]); setResumen(null);}}
  finally {if (!control.signal.aborted) setCargando(false);}
 }, [estado]);
 useEffect(() => {void cargar(); return () => peticion.current?.abort();}, [cargar]);
 async function guardar(form: Formulario, id?: number) {
  setGuardando(true); setError(''); setMensaje('');
  try {await SolicitudesAPI.guardar(form, id); setMensaje(id ? 'Solicitud actualizada correctamente.' : 'Solicitud registrada correctamente.'); await cargar(); return true;}
  catch (e) {setError(mensajeError(e)); return false;}
  finally {setGuardando(false);}
 }
 async function eliminar(id: number) {
  setGuardando(true); setError(''); setMensaje('');
  try {await SolicitudesAPI.eliminar(id); setMensaje('Solicitud eliminada correctamente.'); await cargar(); return true;}
  catch (e) {setError(mensajeError(e)); return false;}
  finally {setGuardando(false);}
 }
 return {estado, setEstado, lista, resumen, cargando, guardando, error, mensaje, cargar, guardar, eliminar};
}
