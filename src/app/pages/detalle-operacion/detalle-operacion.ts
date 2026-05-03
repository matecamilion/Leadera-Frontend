import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OperacionService, Operacion } from '../../core/services/operacion-service';


@Component({
  selector: 'app-detalle-operacion',
  imports: [CommonModule, RouterModule],
  templateUrl: './detalle-operacion.html',
  styleUrl: './detalle-operacion.css',
})
export class DetalleOperacion implements OnInit {
   private route = inject(ActivatedRoute);
  private operacionService = inject(OperacionService);

  operacion = signal<Operacion | null>(null);

  leadId!: number;
  operacionId!: number;

  ngOnInit(): void {
    const leadIdParam = this.route.snapshot.paramMap.get('leadId');
    const operacionIdParam = this.route.snapshot.paramMap.get('operacionId');

    if (leadIdParam && operacionIdParam) {
      this.leadId = Number(leadIdParam);
      this.operacionId = Number(operacionIdParam);

      this.cargarOperacion();
    }
  }

  cargarOperacion() {
    this.operacionService.obtenerOperacionPorId(this.leadId, this.operacionId).subscribe({
      next: (data) => this.operacion.set(data),
      error: (err) => console.error('Error al cargar operación', err)
    });
  }
}
