import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { jwtDecode } from 'jwt-decode';






export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  // --- Permitir rutas públicas o accesos desde el flujo externo (pago cliente)
  const isPublic = !!route.data?.['public'];
  const path = route.routeConfig?.path || state.url || '';
  const origenClienteQuery = route.queryParams && route.queryParams['origen'] === 'cliente';
  const fromOlympusExternalReservar = typeof window !== 'undefined' && window.location.href.includes('olympusf.onrender.com/reservar');

  if (isPublic || path === 'pago-reserva' || origenClienteQuery || (fromOlympusExternalReservar && state.url?.includes('pago-reserva'))) {
    return true;
  }

  // Verifica si el token existe
  if (!token) {
    alert('error: Debes iniciar sesión para acceder a esta página.');
    router.navigate(['/reservar']);
    return false;
  }

  // Decodificar el token para obtener el tipo de usuario
    const decodedToken: any = jwtDecode(token);
    const userType = decodedToken?.typeUser;


  // Verificar si el token es válido y si el rol es correcto
  const requiredRole = route.data['requiredRole'];  // Extrae el rol requerido para la ruta
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowedRoles.includes(userType)) {
      alert('Acceso denegado: Rol no autorizado');
      router.navigate(['/SACH/habitaciones']);
      return false;
    }
  }

  // Si todo es correcto, permite la navegación
  return true;
};
