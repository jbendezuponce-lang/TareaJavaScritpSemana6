import { HttpErrorResponse } from '@angular/common/http';

const SIN_CONEXION = 'No se pudo conectar con la API. Verifica que esté corriendo en el puerto 3000.';

export function apiErrorMessage(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) return 'Ocurrió un error inesperado.';

  if (err.status === 0 || (err.status >= 502 && err.status <= 504)) return SIN_CONEXION;

  const body = typeof err.error === 'object' ? err.error : null;
  if (body?.errors?.length) return body.errors.join('. ');
  if (body?.error) return body.error;

  if (err.status >= 500) return SIN_CONEXION;
  return `Error ${err.status}: ${err.statusText}`;
}
