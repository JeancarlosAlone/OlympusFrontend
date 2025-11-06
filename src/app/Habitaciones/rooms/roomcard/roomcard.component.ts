import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Room, TypesRooms, TypesRoomsStatus } from '../../rooms.model';
import { RoomsService } from '../../rooms.service'; // 🔹 Importar el servicio

@Component({
  selector: 'app-roomcard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roomcard.component.html',
  styleUrls: ['./roomcard.component.css'],
})
export class RoomcardComponent {
  @Input() room!: Room;
  @Input() admin: boolean = false;

  @Output() editarHabitacion = new EventEmitter<Room>();
  @Output() eliminarHabitacion = new EventEmitter<number>();

  mostrarModalOcupada: boolean = false;
  mostrarModalNoEliminable: boolean = false;
  mensajeModal: string = ''; // 🔹 Texto dinámico del modal

  constructor(private router: Router, private roomsService: RoomsService) {}

  /** Redirección al detalle */
  verHabitacion(id: number): void {
    if (this.room.estado === 'ocupada') {
      this.mostrarModalOcupada = true;
      return;
    }
    this.router.navigate(['/SACH/RegistroHuesped', id]);
  }

  cerrarModalOcupada(): void {
    this.mostrarModalOcupada = false;
    this.mostrarModalNoEliminable = false;
  }

  /** Intentar eliminar habitación */
  eliminarRoom(id: number): void {
    if (this.room.estado === 'ocupada') {
      this.mensajeModal = 'No se puede eliminar esta habitación porque actualmente está ocupada.';
      this.mostrarModalNoEliminable = true;
      return;
    }

    this.roomsService.verificarHistoricoReservas(id).subscribe({
      next: (tieneHistorial) => {
        if (tieneHistorial) {
          this.mensajeModal = 'No se puede eliminar esta habitación porque ha tenido reservas previas en el historial.';
          this.mostrarModalNoEliminable = true;
        } else {
          if (confirm('¿Seguro que deseas eliminar esta habitación?')) {
            this.eliminarHabitacion.emit(id);
          }
        }
      },
      error: (err) => {
        console.error('Error al verificar historial de reservas:', err);
        this.mensajeModal = 'No se puede eliminar habitaciòn debido a historial històrico de registros';
        this.mostrarModalNoEliminable = true;
      }
    });
  }

  getEstadoClass(estado: TypesRoomsStatus): string {
    return `estado-${estado}`;
  }

  getTipoHabitacion(tipo: TypesRooms): string {
    switch (tipo) {
      case 'normal': return 'Habitación Normal';
      case 'doble': return 'Habitación Doble';
      case 'plus': return 'Habitación Plus';
      default: return tipo;
    }
  }

  editarRoom(room: Room): void {
    this.editarHabitacion.emit(room);
  }
}
