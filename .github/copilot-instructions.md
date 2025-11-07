## Quick orientation — ProyectoHoteleroFront

This Angular front-end is a small single-page app (standalone components are used in places) that talks to a backend at http://localhost:8080. The UI is Spanish-centric (variable and route names in Spanish) — treat Spanish identifiers as canonical when searching the codebase.

Key places to look
- `src/app/` — main app folder. Subfolders are by feature: `Habitaciones/`, `Huesped/`, `services/`, `pago-reserva/` etc.
- `src/app/pago-reserva/pago-reserva.component.ts` — example integration with PayPal and backend payment/factura endpoints. Useful for payment flow, localStorage keys and navigation patterns.
- `src/app/services/reserva.service.ts` — holds reservation state accessible across components via `getReserva()` / `clearReserva()`.
- `src/app/Habitaciones/rooms.service.ts` and `src/app/Habitaciones/rooms.model.ts` — room status enum (`TypesRoomsStatus`) and status update calls (used after reservation registration).
- `app.routes.ts` and `app.config.ts` — routing and app-level constants.

Big-picture architecture
- Frontend-only Angular SPA that delegates persistence and business logic to a backend on `localhost:8080` (endpoints under `/api/*`).
- Services (in `src/app/services` and feature folders) are the boundary between UI and backend. Common flow: component -> service -> backend -> component handles result.
- Reservation flow example: user fills reservation -> `ReservaService` keeps the in-memory reservation -> `pago-reserva` component posts payment to backend -> on success it calls `HuespedService.createHuesped(...)` then `RoomsService.changeStatus(...)`.

Project-specific conventions and gotchas
- Spanish identifiers: look for `huesped`, `habitacion`, `reserva`, `servicios` when searching for domain code.
- LocalStorage is used for quick cross-route state: keys include `cliente`, `rol`, `idRoomReservacion`, `idUser`. Examples: `pago-reserva.component.ts` uses these for navigation and context detection.
- Role-based routes: admin/usuario UI is namespaced under `/SACH/` while guest flow uses routes like `/reservar` — use `isUserContext()` patterns in `pago-reserva` to infer navigation.
- PayPal integration is client-side: the code expects `window.paypal` to be injected in the page. The component polls `window.paypal` before rendering the button.
- Backend URLs are hard-coded to `http://localhost:8080` in multiple components (payments and invoices). Update carefully if backend host/port changes and consider a central config file.

Developer workflows (how to run & debug)
- Install dependencies: `npm install`
- Start dev server: `npm start` (there is an npm start task in the workspace). This runs the Angular dev server.
- Run tests: `npm test` (there is an npm test task; tests are minimal).
- Debugging tips:
  - Check browser console when testing PayPal flows. The PayPal SDK is loaded externally and components poll `window.paypal`.
  - Inspect network calls to `http://localhost:8080/api/...` to verify CORS and backend responses.
  - If navigation seems to fail across routes, search for `navigateHard` / `router.navigateByUrl` patterns — the code sometimes uses `NgZone` and `window.location.assign` fallbacks.

Patterns to follow when editing
- Use existing services for backend access (do not call fetch() directly from new components — a few legacy components do use fetch; prefer adding/updating a service instead).
- Preserve Spanish names for domain objects and routes.
- When registering a guest after payment, follow the pattern in `pago-reserva.component.ts`: create the guest via `HuespedService`, then change room status via `RoomsService`, then clear the reservation via `ReservaService.clearReserva()`.
- Prefer `firstValueFrom(...)` on observables for one-shot calls (this pattern is used in `pago-reserva`).

Integration points & external deps
 - PayPal: window.paypal is used. Button rendering is client-side; the component renders the PayPal buttons into the element with id paypal-button-container (see src/app/pago-reserva/pago-reserva.component.ts).
- Backend: `http://localhost:8080/api/pagos/*` and `/api/facturas/*` are used by `pago-reserva.component.ts`.
- Email/invoice generation is delegated to backend `/api/facturas/generar`.

Search tips & examples
- To find where reservation state is read/updated: search for `getReserva(` and `clearReserva(`.
- To find room status enum usage: search `TypesRoomsStatus` or `changeStatus(` in `src/app/Habitaciones`.
- Example: open `src/app/pago-reserva/pago-reserva.component.ts` and look for these concrete lines:
  - LocalStorage keys: `localStorage.getItem('rol')`, `localStorage.setItem('cliente', ...)`
  - Backend payment endpoints: `http://localhost:8080/api/pagos/crear-orden` and `/capturar-orden`

When to ask the author
- If you need environment variables (backend host/port) — these are not centralized; ask whether to introduce an `environment.ts` or use `app.config.ts`.
- If you need a centralized PayPal SDK loader — currently components poll `window.paypal`, so propose a shared loader/service.

If anything here is unclear or you want additional examples (routing maps, list of localStorage keys, or a suggested refactor to centralize backend URLs), tell me which section to expand.
