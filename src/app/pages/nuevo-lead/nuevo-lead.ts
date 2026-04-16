import { Component, inject } from '@angular/core';
import { Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LeadService } from '../../core/services/lead-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nuevo-lead',
  imports: [ReactiveFormsModule],
  templateUrl: './nuevo-lead.html',
  styleUrl: './nuevo-lead.css',
})
export class NuevoLead {
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);
  private router = inject(Router);
  private location = inject(Location); // Inyectamos el servicio

  // Creá un método para volver atrás
  volver() {
    this.location.back();
  }

 public leadForm = this.fb.group({
  nombre: ['', [Validators.required]],
  apellido: ['', [Validators.required]],
  telefono: ['', [Validators.required]],
  email: ['', [Validators.email]],
  tipoLead: ['COMPRADOR', [Validators.required]],
  estado: ['FRIO', [Validators.required]], // Lo seteamos inicial pero visible por si ya es un contacto caliente
  fechaProximoSeguimiento: [''] // Opcional por si ya querés agendar la primera llamada
});

  guardar() {
  if (this.leadForm.invalid) return;

  // Enviamos el objeto lead al backend
  this.leadService.crearLead(this.leadForm.value).subscribe({
    next: (leadCreado) => {
      // Usamos el ID que devolvió el backend (Long id)
      const irABusqueda = confirm('¡Lead creado con éxito! ¿Deseas configurar las preferencias de búsqueda ahora?');

      if (irABusqueda) {
        // Navegamos a la ruta de búsqueda pasando el ID recién creado
        this.router.navigate(['/leads', leadCreado.id, 'busqueda']);
      } else {
        this.router.navigate(['/leads']);
      }
    },
    error: (err) => {
      console.error('Error al crear el lead', err);
      alert('Error al conectar con el servidor de LeadEra');
    }
  });
}
}
