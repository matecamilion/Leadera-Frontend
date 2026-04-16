
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LeadService } from '../../core/services/lead-service'
import { Lead } from '../../core/models/lead'

@Component({
  selector: 'app-gestionar-busqueda',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './gestionar-busqueda.html',
  styleUrl: './gestionar-busqueda.css'
})
export class GestionarBusquedaComponent implements OnInit {
  // Inyecciones modernas con inject()
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private leadService = inject(LeadService);

  public busquedaForm: FormGroup;
  public leadId!: number;
  public cargando = false;

  constructor() {
    // Definición del formulario con validaciones iniciales
    this.busquedaForm = this.fb.group({
      precioMin: [0, [Validators.min(0)]],
      precioMax: [null, [Validators.required, Validators.min(0)]],
      cantidadAmbientes: [null, [Validators.required, Validators.min(1)]],
      metrosTotales: [null, [Validators.required, Validators.min(1)]],
      metrosCubiertos: [null, [Validators.min(0)]],
      metrosDescubiertos: [null, [Validators.min(0)]],
      tipoVivienda: ['', Validators.required],
      zona: ['', Validators.required],
      observaciones: ['']
    }, { 
      // Validadores que comparan varios campos entre sí
      validators: [this.verificarRangosLogicos] 
    });

    // Opcional: Escuchar cambios para autocalcular metros descubiertos
    this.setupSuscripcionesMetros();
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.leadId = Number(idParam);
      this.cargarDatosExistentes();
    }
  }

  private cargarDatosExistentes() {
    this.cargando = true;
    this.leadService.getLeadById(this.leadId).subscribe({
      next: (lead: Lead) => {
        if (lead.busqueda) {
          this.busquedaForm.patchValue(lead.busqueda);
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error("Error al cargar el lead", err);
        this.cargando = false;
      }
    });
  }

  // Validador personalizado para coherencia de datos
  private verificarRangosLogicos(control: AbstractControl): ValidationErrors | null {
    const pMin = control.get('precioMin')?.value;
    const pMax = control.get('precioMax')?.value;
    const mCub = control.get('metrosCubiertos')?.value;
    const mTot = control.get('metrosTotales')?.value;

    const errors: any = {};

    if (pMin !== null && pMax !== null && pMin > pMax) {
      errors['precioInconsistente'] = true;
    }

    if (mCub !== null && mTot !== null && mCub > mTot) {
      errors['metrosInconsistentes'] = true;
    }

    return Object.keys(errors).length ? errors : null;
  }

  // Lógica para autocalcular metros descubiertos (Total - Cubiertos)
  private setupSuscripcionesMetros() {
    this.busquedaForm.valueChanges.subscribe(val => {
      const totales = val.metrosTotales || 0;
      const cubiertos = val.metrosCubiertos || 0;
      const descubiertosCalculados = totales - cubiertos;
      
      // Solo actualizamos si el resultado es lógico para evitar bucles infinitos
      if (descubiertosCalculados >= 0 && val.metrosDescubiertos !== descubiertosCalculados) {
        this.busquedaForm.get('metrosDescubiertos')?.setValue(descubiertosCalculados, { emitEvent: false });
      }
    });
  }

  guardar() {
    if (this.busquedaForm.invalid) {
      this.busquedaForm.markAllAsTouched();
      return;
    }

    const datosEnvio = this.busquedaForm.value;
    
    this.leadService.guardarBusqueda(this.leadId, datosEnvio).subscribe({
      next: () => {
        // Redirigir al detalle del lead tras éxito
        this.router.navigate(['/leads', this.leadId]);
      },
      error: (err: any) => {
        alert("Hubo un error al guardar la búsqueda. Intenta nuevamente.");
        console.error(err);
      }
    });
  }

  // Getters para facilitar el manejo de errores en el HTML
  get f() { return this.busquedaForm.controls; }
}