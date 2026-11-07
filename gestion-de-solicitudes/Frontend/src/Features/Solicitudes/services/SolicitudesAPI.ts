import { http } from '../../../Shared/http';
export const estados = ['Pendiente', 'En proceso', 'Resuelta'] as const;
export type Estado = typeof estados[number];
export interface Solicitud { idSolicitud: number; solicitante: string; asunto: string; descripcion: string; estado: Estado; fechaRegistro: string }
export type Formulario = Pick<Solicitud, 'solicitante' | 'asunto' | 'descripcion' | 'estado'>;
export interface Resumen { total: number; pendientes: number; enProceso: number; resueltas: number }
interface Respuesta<T> { ok: boolean; mensaje: string; valorRetorno: T }
async function valor<T>(peticion: Promise<{data: Respuesta<T>}>) {
 const {data} = await peticion;
 if (!data.ok) throw new Error(data.mensaje);
 return data.valorRetorno;
}
export const SolicitudesAPI = {
 listar: (estado: string, signal?: AbortSignal) => valor(http.get<Respuesta<Solicitud[]>>('/Solicitudes', {params: estado ? {estado} : {}, signal})),
 resumen: (signal?: AbortSignal) => valor(http.get<Respuesta<Resumen>>('/Solicitudes/resumen', {signal})),
 guardar: (form: Formulario, id?: number) => id
  ? valor(http.put<Respuesta<Solicitud>>(`/Solicitudes/${id}`, form))
  : valor(http.post<Respuesta<Solicitud>>('/Solicitudes', form)),
 eliminar: (id: number) => valor(http.delete<Respuesta<boolean>>(`/Solicitudes/${id}`)),
};
