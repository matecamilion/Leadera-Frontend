import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LeadService } from '../../core/services/lead-service';

@Component({
  selector: 'app-detalle-lead',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-lead.html',
  styleUrl: './detalle-lead.css'
})
export class DetalleLead implements OnInit {
  private route = inject(ActivatedRoute);
  private leadService = inject(LeadService);

  // Usamos un signal para manejar el objeto lead de forma reactiva
  public lead = signal<any>(null);
  public id: number = 0;

  nuevoTelefono: string = '';
nuevoEmail: string = '';
errorContacto: string = '';

guardarContacto(modal: HTMLDialogElement) {
  this.errorContacto = '';
  this.leadService.editarContacto(this.lead()!.id, this.nuevoTelefono, this.nuevoEmail).subscribe({
    next: (leadActualizado) => {
      this.lead.set(leadActualizado);
      modal.close();
    },
    error: (err) => {
      this.errorContacto = err.error || 'Ya existe un lead con ese teléfono o email.';
    }
  });
}

  ngOnInit(): void {
    const paramsId = this.route.snapshot.paramMap.get('id');
    if (paramsId) {
      this.id = Number(paramsId);
      this.cargarDetalleLead();
    }
  }

  cargarDetalleLead() {
    this.leadService.getLeadById(this.id).subscribe({
      next: (data) => {
        this.lead.set(data); // Guardamos la respuesta del backend
      },
      error: (err) => console.error('Error al traer el lead', err)
    });
  }

  // 2. Función para procesar el cambio
confirmarCambio(nuevoEstado: string, modal: HTMLDialogElement) {
  this.leadService.actualizarEstado(this.lead()!.id, nuevoEstado).subscribe({
    next: (leadActualizado) => {
      // Actualizamos la señal para que la UI cambie al instante
      this.lead.set(leadActualizado); 
      modal.close(); // Cerramos el modal
    },
    error: (err) => {
      console.error(err);
      alert("No se pudo actualizar el estado");
    }
  });
}

establecerLeadInactivo(modal: HTMLDialogElement){
  this.leadService.establecerLeadInactivo(this.lead()!.id).subscribe({
    next: (leadActualizado) => {
      this.lead.set(leadActualizado);
      modal.close();
    },
    error: (err) => {
      console.log(err);
      alert("No se pudo establecer como inactivo")
    }
  })
}
}