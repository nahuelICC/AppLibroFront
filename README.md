# Tinteka

Esto proyecto ha sido generdo con [Angular CLI](https://github.com/angular/angular-cli) version 18.2.11.

# Frontend de la Aplicación de Librería con opciones de suscripción

Este es el frontend de una aplicación web dedicada a la venta de libros de una libreria, con opciones de suscripción para el envio periódico de libros del género eligido, además de administración completa de la página a través de administrador.

## Características

- **Interfaz de usuario moderna**: Diseñada con Angular Material y Tailwind.
- **Tienda Completa**: Tienda completa con catálogo con varios filtros, que permite la compra con varias opciones de pago.
- **Gestión completa**: A través de su perfil el usuario puede gestionar todos los datos de su cuenta, incluida contraseña, datos personales, pedidos y suscripción.
- **Comentarios**: Sistema para añadir y gestionar comentarios.
- **Subida de imágenes**: Interfaz para subir imágenes que servirán de portadas para los libros.
- **Autenticación basada en roles**: Diferentes vistas según el rol del usuario (cliente o administrador).

## Tecnologías Utilizadas

- **Angular**: Framework principal para el desarrollo del frontend.
- **Angular Material**: Componentes estilizados para una mejor experiencia de usuario.
- **Tailwind**: Componentes adicionales para diseño responsive.
- **Cloudinary**: Gestión y almacenamiento de imágenes.
- **Html2Canvas**: Utilizado para los PDF de las compras en el frontend.
- **Jspdf**: Librería para generar Pdfs en Javascript.
- **JWT (JSON Web Tokens)**: Autenticación y autorización segura con el backend.

## Instalación

1. **Clonar el repositorio**:
   ```bash
   https://github.com/nahuelICC/AppLibroFront.git

2. **Instalar dependencias**:
   
   ```bash
   npm install
   

3. **Ejecutar la aplicación**:
   ```bash
   ng serve
   
  - Accede a la aplicación en http://localhost:4200

4. **Acceder a Compodoc**:
   Para consultar la documentación se puede acceder a Compodoc.
   
   ```bash
   npm run compodoc:serve

5. **Acceder a aplicación desplegada**:
   Para acceder a la aplicación desplegada.
   
   ```bash
   https://applibrofront.onrender.com


## Contribución

1. **Realiza un fork del repositorio.**

2. **Crea tu rama para tu funcionalidad**
   
   ```bash
   git checkout -b feature/nueva-funcionalidad
   
4. **Realiza un pull request con tus cambios.**
 

## Más ayuda

Para obtener más ayuda usa `ng help` o visita [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
