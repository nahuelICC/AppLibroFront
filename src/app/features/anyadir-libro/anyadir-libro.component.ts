import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {LibroService} from './services/libro.service';
import {GeneroDTO} from '../tienda/DTOs/GeneroDTO';
import {NombreGeneroPipe} from '../tienda/pipes/nombre-genero.pipe';
import {IdiomaDTO} from './DTO/IdiomaDTO';

declare var cloudinary: any;

@Component({
  selector: 'app-anyadir-libro',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NombreGeneroPipe
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
  cloudinaryUrl: string | null = null;

  constructor(private fb: FormBuilder, private libroService: LibroService) {
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

  ngOnInit(): void {
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



  campoInvalido(campo: string) {
    return this.libroForm.get(campo)?.invalid && this.libroForm.get(campo)?.touched;
  }

  validarFecha(control: any) {
    return new Date(control.value) > new Date() ? { fechaInvalida: true } : null;
  }


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

  enviarFormulario(event: Event): void {
    event.preventDefault();
    if (this.libroForm.invalid || !this.portadaSeleccionada) {
      this.libroForm.markAllAsTouched();
      return;
    }

    this.uploadImageToCloudinary(this.portadaSeleccionada).then((url) => {
      this.cloudinaryUrl = url; // Save the URL

      const formData = new FormData();
      formData.append('titulo', this.libroForm.get('titulo')?.value);
      formData.append('autor', this.libroForm.get('autor')?.value);
      formData.append('genero', this.libroForm.get('genero')?.value);
      formData.append('editorial', this.libroForm.get('editorial')?.value);
      formData.append('isbn', this.libroForm.get('isbn')?.value);
      formData.append('idioma', this.libroForm.get('idioma')?.value);
      formData.append('fechaPublicacion', this.libroForm.get('fechaPublicacion')?.value);
      formData.append('paginas', this.libroForm.get('paginas')?.value);
      formData.append('descripcion', this.libroForm.get('descripcion')?.value);
      formData.append('portada', this.cloudinaryUrl);

      if (this.libroForm.get('tapaBlanda')?.value) {
        formData.append('tapaBlanda', 'true');
        formData.append('precioBlanda', this.libroForm.get('precioTapaBlanda')?.value);
      } else {
        formData.append('tapaBlanda', 'false');
      }

      if (this.libroForm.get('tapaDura')?.value) {
        formData.append('tapaDura', 'true');
        formData.append('precioDura', this.libroForm.get('precioTapaDura')?.value);
      } else {
        formData.append('tapaDura', 'false');
      }

      this.libroService.postLibro(formData).subscribe({
        next: (res) => alert('Libro guardado con éxito'),
        error: (err) => alert('Error al guardar el libro'),
      });
    }).catch((err) => {
      console.error(err);
      alert('Error al subir la imagen');
    });
  }


}

