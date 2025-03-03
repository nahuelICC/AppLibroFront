import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {LibroService} from './services/libro.service';
import {GeneroDTO} from '../tienda/DTOs/GeneroDTO';
import {NombreGeneroPipe} from '../tienda/pipes/nombre-genero.pipe';
import {IdiomaDTO} from './DTO/IdiomaDTO';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertInfoComponent, AlertType} from '../../shared/components/alert-info/alert-info.component';

declare var cloudinary: any;

/**
 * Componente que muestra el formulario para añadir un libro
 */
@Component({
  selector: 'app-anyadir-libro',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NombreGeneroPipe,
    NgClass,
    AlertInfoComponent
  ],
  templateUrl: './anyadir-libro.component.html',
  standalone: true,
  styleUrl: './anyadir-libro.component.css'
})
export class AnyadirLibroComponent implements OnInit{
  libroForm: FormGroup;
  portadaSubida: boolean = false;
  generos: GeneroDTO[] = [];
  idiomas: IdiomaDTO[] = [];
  portadaSeleccionada: File | null = null;
  imagenPreview: string | null = null;


  isEditMode: boolean = false;
  libroId: string | null = null;
  existingPortadaUrl: string | null = null;
  enVenta: boolean = false;

  alertaVisible: boolean = false;
  tipoAlerta: AlertType = 'success';
  mensajeAlerta: string = '';

  constructor(private fb: FormBuilder, private libroService: LibroService, private route: ActivatedRoute, private router: Router) {
    this.libroForm = this.fb.group({
      titulo: ['', Validators.required],
      autor: ['', Validators.required],
      genero: ['', Validators.required],
      editorial: ['', Validators.required],
      isbn: ['', [Validators.required, Validators.pattern(/^\d{10,13}$/)]],
      idioma: ['', Validators.required],
      fechaPublicacion: ['', Validators.required],
      paginas: ['', [Validators.required, Validators.min(1)]],
      tapaBlanda: [false],
      precioTapaBlanda: [{ value: '', disabled: true }, [Validators.min(0)]],
      tapaDura: [false],
      precioTapaDura: [{ value: '', disabled: true }, [Validators.min(0)]],
      descripcion: ['', [Validators.required, Validators.minLength(20)]]
    });

    this.libroForm.get('tapaBlanda')?.valueChanges.subscribe(value => {
      if (value) {
        this.libroForm.get('precioTapaBlanda')?.enable();
      } else {
        this.libroForm.get('precioTapaBlanda')?.disable();
      }
    });

    this.libroForm.get('tapaDura')?.valueChanges.subscribe(value => {
      if (value) {
        this.libroForm.get('precioTapaDura')?.enable();
      } else {
        this.libroForm.get('precioTapaDura')?.disable();
      }
    });
  }

  /**
   * Inicializa el componente
   */
  ngOnInit(): void {
    this.libroId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.libroId;

    if (this.isEditMode) {
      this.cargarLibroExistente();
    }

    this.libroService.getGeneros().subscribe({
      next: (res: any[]) => {
        this.generos = res;
      },
      error: (err) => {
        console.error('Error al cargar generos:', err);
      }
    });
    this.libroService.getIdiomas().subscribe({
      next: (res: any[]) => {
        this.idiomas = res;
      },
      error: (err) => {
        console.error('Error al cargar idiomas:', err);
      }
    })
  }

  /**
   * Carga los datos de un libro existente
   */
  cargarLibroExistente(): void {
    this.libroService.getLibroById(this.libroId!).subscribe(libro => {
      this.libroForm.patchValue({
        titulo: libro.titulo,
        autor: libro.autor,
        genero: libro.genero,
        editorial: libro.editorial,
        isbn: libro.isbn,
        idioma: libro.idioma,
        fechaPublicacion: libro.fechaPublicacion.split('T')[0],
        paginas: libro.paginas,
        tapaBlanda: libro.tapaBlanda,
        precioTapaBlanda: libro.precioBlanda || '',
        tapaDura: libro.tapaDura,
        precioTapaDura: libro.precioDura || '',
        descripcion: libro.descripcion
      });

      this.existingPortadaUrl = libro.portada;
      this.imagenPreview = libro.portada;
      this.portadaSubida = true;
      this.enVenta = libro.en_venta;
    });
  }


  /**
   * Comprueba si un campo es inválido
   * @param campo
   */
  campoInvalido(campo: string) {
    return this.libroForm.get(campo)?.invalid && this.libroForm.get(campo)?.touched;
  }

  /**
   * Comprueba si un campo es válido
   * @param control
   */
  validarFecha(control: any) {
    return new Date(control.value) > new Date() ? { fechaInvalida: true } : null;
  }

  /**
   * Sube una imagen a Cloudinary
   * @param file
   */
  uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'tinteka'); // Configura tu upload preset en Cloudinary

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/dagjuixoi/image/upload`, true);

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url); // La URL segura de Cloudinary
        } else {
          reject('Error al subir la imagen');
        }
      };

      xhr.onerror = () => reject('Error de conexión');

      xhr.send(formData);
    });
  }

  /**
   * Selecciona un archivo
   * @param event
   */
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.portadaSeleccionada = input.files[0];
      this.portadaSubida = true;

      // Generate preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(this.portadaSeleccionada as Blob);
    }
  }

  /**
   * Envía el formulario
   * @param event
   */
  enviarFormulario(event: Event): void {
    event.preventDefault();
    if (this.libroForm.invalid || (!this.portadaSubida && !this.isEditMode)) {
      this.libroForm.markAllAsTouched();
      return;
    }

    const submitData = (portadaUrl: string) => {
      const formData = {
        ...this.libroForm.value,
        portada: portadaUrl,
        genero: +this.libroForm.value.genero,
        idioma: +this.libroForm.value.idioma
      };

      if (this.isEditMode) {
        formData.en_venta = this.enVenta;
        this.libroService.putLibro(this.libroId!, formData).subscribe({
          next: () => {
            this.router.navigate(['/admin']);
          },
          error: () =>{
            this.alertaVisible = true;
            this.tipoAlerta = 'error';
            this.mensajeAlerta = 'Error al actualizar libro.'
          }
        });
      } else {
        this.libroService.postLibro(formData).subscribe({
          next: () => {
            this.router.navigate(['/admin']);
          },
          error: () => {
            this.alertaVisible = true;
            this.tipoAlerta = 'error';
            this.mensajeAlerta = 'Error al crear libro.'
          }
        });
      }
    };

    if (this.portadaSeleccionada) {
      this.uploadImageToCloudinary(this.portadaSeleccionada)
        .then(submitData)
        .catch(() => alert('Error al subir la imagen'));
    } else {
      submitData(this.existingPortadaUrl!);
    }
  }

  /**
   * Cambia el estado de enVenta
   */
  cambioEnVenta() {
    this.enVenta = !this.enVenta;
  }
}

