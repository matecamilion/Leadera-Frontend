import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LeadService } from '../../core/services/lead-service';
import { FormsModule } from '@angular/forms';
import { PropiedadService } from '../../core/services/propiedad-service';
import { Propiedad } from '../../core/models/propiedad';
import { DetallePropiedadComponent } from '../detalle-propiedad/detalle-propiedad';

@Component({
  selector: 'app-detalle-lead',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DetallePropiedadComponent],
  templateUrl: './detalle-lead.html',
  styleUrl: './detalle-lead.css'
})
export class DetalleLead implements OnInit {
  private route = inject(ActivatedRoute);
  private leadService = inject(LeadService);
  private propiedadService = inject(PropiedadService);

  public lead = signal<any>(null);
  public id: number = 0;

  // Contacto
  nuevoTelefono: string = '';
  nuevoEmail: string = '';
  errorContacto: string = '';

  // Propiedades
  propiedades = signal<Propiedad[]>([]);
  propiedadSeleccionada = signal<Propiedad | null>(null);
  nuevaPropiedad: Partial<Propiedad> = {};

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
        this.lead.set(data);
        this.cargarPropiedades();
      },
      error: (err) => console.error('Error al traer el lead', err)
    });
  }

  cargarPropiedades() {
    if (this.lead()?.tipoLead === 'VENDEDOR') {
      this.propiedadService.obtenerPorLead(this.id).subscribe({
        next: (data) => this.propiedades.set(data),
        error: (err) => console.error(err)
      });
    }
  }

  agregarPropiedad(modal: HTMLDialogElement) {
    this.propiedadService.agregar(this.id, this.nuevaPropiedad).subscribe({
      next: (p) => {
        this.propiedades.update(list => [...list, p]);
        this.nuevaPropiedad = {};
        modal.close();
      },
      error: (err) => console.error(err)
    });
  }

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

  confirmarCambio(nuevoEstado: string, modal: HTMLDialogElement) {
    this.leadService.actualizarEstado(this.lead()!.id, nuevoEstado).subscribe({
      next: (leadActualizado) => {
        this.lead.set(leadActualizado);
        modal.close();
      },
      error: (err) => {
        console.error(err);
        alert("No se pudo actualizar el estado");
      }
    });
  }

  establecerLeadInactivo(modal: HTMLDialogElement) {
    this.leadService.establecerLeadInactivo(this.lead()!.id).subscribe({
      next: (leadActualizado) => {
        this.lead.set(leadActualizado);
        modal.close();
      },
      error: (err) => {
        console.log(err);
        alert("No se pudo establecer como inactivo");
      }
    });
  }
}