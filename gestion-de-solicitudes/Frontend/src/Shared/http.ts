import axios from 'axios';
export const http = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 15000 });
export function mensajeError(error: unknown): string {
 if (axios.isAxiosError(error)) return error.response?.data?.mensaje || 'No se pudo conectar con la API. Verifica que esté iniciada e intenta de nuevo.';
 return error instanceof Error ? error.message : 'Ocurrió un error inesperado.';
}
