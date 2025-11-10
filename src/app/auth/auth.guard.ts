import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const token = localStorage.getItem('token');
  const storedId = localStorage.getItem('idUser');
  const storedRole = localStorage.getItem('rol');
  const requiredRole = route.data['requiredRole'];  // Extrae el rol requerido para la ruta

  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  // Verifica si el token existe o si la ruta es pública
const isPublic = !!route.data?.['public'];
const path = route.routeConfig?.path || state.url || '';
const origenClienteQuery = route.queryParams && route.queryParams['origen'] === 'cliente';
const fromOlympusExternalReservar = typeof window !== 'undefined' && window.location.href.includes('olympusf.onrender.com/reservar');

// Permitir páginas públicas, o si la URL de la ruta es pago-reserva o si proviene de reservar
if (isPublic || path === 'pago-reserva' || origenClienteQuery || (fromOlympusExternalReservar && state.url?.includes('pago-reserva'))) {
  return true;  // Permite el acceso
}

// Verifica si el token existe
if (!token) {
  alert('error: Debes iniciar sesión para acceder a esta página.');
  router.navigate(['/reservar']);  // Redirige a la página de reserva
  return false;
}


  // Si la ruta requiere un rol específico, verifica si el rol del usuario coincide
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(storedRole)) {
      alert('Acceso denegado: Rol no autorizado');
      router.navigate(['/SACH/habitaciones']); // Redirige si el rol no es autorizado
      return false;
    }
  }

  // Si todo es correcto, permite la navegación
  return true;
};
