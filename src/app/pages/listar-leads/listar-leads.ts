import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadService } from '../../core/services/lead-service';// Ajusta la ruta a tu servicio
import { Lead } from '../../core/models/lead';
import { TiempoTranscurridoPipe } from '../../pipes/tiempo-transcurrido-pipe';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-listado-leads',
  standalone: true,
  imports: [CommonModule, FormsModule, TiempoTranscurridoPipe, RouterModule],
  templateUrl: './listar-leads.html',
  styleUrls: ['./listar-leads.css']
})
export class ListadoLeadsComponent implements OnInit {
  private servicioLead = inject(LeadService);

  // Signals
  leads = signal<Lead[]>([]);
  cargando = signal<boolean>(true);
  filtroBusqueda = signal<string>('');
  estadoSeleccionado = signal<string>('TODOS');

  // Lógica reactiva para filtrar
  leadsFiltrados = computed(() => {
    let filtrados = this.leads();

    // Filtro por pestañas de estado
    if (this.estadoSeleccionado() !== 'TODOS') {
      filtrados = filtrados.filter(l => l.estado === this.estadoSeleccionado());
    }

    // Filtro por texto (Nombre, Apellido o Zona)
    const busqueda = this.filtroBusqueda().toLowerCase().trim();
    if (busqueda) {
      filtrados = filtrados.filter(l => 
        l.nombre.toLowerCase().includes(busqueda) ||
        l.apellido.toLowerCase().includes(busqueda) ||
        l.busqueda?.zona?.toLowerCase().includes(busqueda)
      );
    }

    return filtrados;
  });

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando.set(true);
    this.servicioLead.getLeads().subscribe({
      next: (resultado) => {
        this.leads.set(resultado);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  // Helper para obtener el detalle de la última interacción sin romper el template
  obtenerUltimoDetalle(lead: Lead): string {
  // 1. Verificamos que existan interacciones
  if (lead.interacciones && lead.interacciones.length > 0) {
    
    // 2. Accedemos al último objeto del array
    const ultima = lead.interacciones[lead.interacciones.length - 1];
    
    // 3. Retornamos la propiedad 'detalle' de ese objeto
    return ultima.detalle || 'Sin detalle'; 
  }
  
  return 'Sin interacciones registradas';
}
}