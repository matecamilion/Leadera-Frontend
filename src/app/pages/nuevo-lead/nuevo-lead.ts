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
  estado: ['FRIO', [Validators.required]],
  fechaProximoSeguimiento: ['']
});

  guardar() {
  if (this.leadForm.invalid) return;

  // Enviamos el objeto lead al backend
  this.leadService.crearLead(this.leadForm.value).subscribe({
    next: (leadCreado) => {
      this.router.navigate(['/leads', leadCreado.id]);
    },
    error: (err) => {
      console.error('Error al crear el lead', err);
      alert('Error al conectar con el servidor de LeadEra');
    }
  });
}
}
