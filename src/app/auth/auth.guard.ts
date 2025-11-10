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

  // --- Permitir rutas públicas o accesos desde el flujo externo (pago cliente)
  // Marca de ruta pública (opcional): { data: { public: true } }
  const isPublic = !!route.data?.['public'];
  const path = route.routeConfig?.path || state.url || '';
  const origenClienteQuery = route.queryParams && route.queryParams['origen'] === 'cliente';
  // Si la app se cargó en el dominio externo con la ruta /reservar, permitimos acceder a pago-reserva
  const fromOlympusExternalReservar = typeof window !== 'undefined' && window.location.href.includes('olympusf.onrender.com/reservar');

  if (isPublic || path === 'pago-reserva' || origenClienteQuery || (fromOlympusExternalReservar && state.url?.includes('pago-reserva'))) {
    return true;
  }

  // Verifica si el token existe
  if (!token) {
    // snackBar.open('Debes iniciar sesión para acceder a esta página.', 'Cerrar', { duration: 3000 });
    alert('error: Debes iniciar sesión para acceder a esta página.');
    router.navigate(['/reservar']);
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