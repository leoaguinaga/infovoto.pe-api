# Guía de Subida de Archivos

## Descripción General

El sistema de subida de archivos permite almacenar imágenes para:
- **Partidos políticos**: Foto/logo del partido
- **Candidatos**: Foto del candidato
- **Posts**: Hasta 5 imágenes por post
- **Comentarios**: Hasta 3 imágenes por comentario

## Configuración

- **Ubicación de archivos**: `./uploads/`
- **Tamaño máximo por archivo**: 5MB
- **Formatos permitidos**: JPG, JPEG, PNG, GIF, WEBP
- **URL de acceso**: `http://localhost:3000/uploads/{carpeta}/{nombre-archivo}`

## Endpoints Disponibles

### 1. Subir Foto de Partido Político

**Endpoint**: `POST /political-groups/:id/upload-photo`

**Descripción**: Sube la foto/logo de un partido político específico.

**Parámetros**:
- `id` (path): ID del partido político

**Body**: `multipart/form-data`
- `file`: Archivo de imagen

**Ejemplo con cURL**:
```bash
curl -X POST http://localhost:3000/political-groups/1/upload-photo \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/ruta/a/tu/imagen.jpg"
```

**Respuesta exitosa**:
```json
{
  "success": true,
  "message": "Foto subida correctamente",
  "data": {
    "filename": "photo-1699999999999-123456789.jpg",
    "url": "/uploads/political-groups/photo-1699999999999-123456789.jpg"
  }
}
```

---

### 2. Subir Foto de Candidato

**Endpoint**: `POST /candidates/:id/upload-photo`

**Descripción**: Sube la foto de un candidato específico.

**Parámetros**:
- `id` (path): ID del candidato

**Body**: `multipart/form-data`
- `file`: Archivo de imagen

**Ejemplo con cURL**:
```bash
curl -X POST http://localhost:3000/candidates/1/upload-photo \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/ruta/a/tu/imagen.jpg"
```

**Respuesta exitosa**:
```json
{
  "success": true,
  "message": "Foto subida correctamente",
  "data": {
    "filename": "photo-1699999999999-123456789.jpg",
    "url": "/uploads/candidates/photo-1699999999999-123456789.jpg"
  }
}
```

---

### 3. Subir Imágenes de Post

**Endpoint**: `POST /posts/:id/upload-images`

**Descripción**: Sube hasta 5 imágenes para un post específico.

**Parámetros**:
- `id` (path): ID del post

**Body**: `multipart/form-data`
- `files`: Array de archivos de imagen (máximo 5)

**Ejemplo con cURL**:
```bash
curl -X POST http://localhost:3000/posts/1/upload-images \
  -H "Content-Type: multipart/form-data" \
  -F "files=@/ruta/imagen1.jpg" \
  -F "files=@/ruta/imagen2.jpg" \
  -F "files=@/ruta/imagen3.jpg"
```

**Respuesta exitosa**:
```json
{
  "success": true,
  "message": "Imágenes subidas correctamente",
  "data": {
    "count": 3,
    "files": [
      {
        "filename": "image-1699999999999-123456789.jpg",
        "url": "/uploads/posts/image-1699999999999-123456789.jpg"
      },
      {
        "filename": "image-1699999999999-987654321.jpg",
        "url": "/uploads/posts/image-1699999999999-987654321.jpg"
      },
      {
        "filename": "image-1699999999999-555555555.jpg",
        "url": "/uploads/posts/image-1699999999999-555555555.jpg"
      }
    ]
  }
}
```

---

### 4. Subir Imágenes de Comentario

**Endpoint**: `POST /comments/:id/upload-images`

**Descripción**: Sube hasta 3 imágenes para un comentario específico.

**Parámetros**:
- `id` (path): ID del comentario

**Body**: `multipart/form-data`
- `files`: Array de archivos de imagen (máximo 3)

**Ejemplo con cURL**:
```bash
curl -X POST http://localhost:3000/comments/1/upload-images \
  -H "Content-Type: multipart/form-data" \
  -F "files=@/ruta/imagen1.jpg" \
  -F "files=@/ruta/imagen2.jpg"
```

**Respuesta exitosa**:
```json
{
  "success": true,
  "message": "Imágenes subidas correctamente",
  "data": {
    "count": 2,
    "files": [
      {
        "filename": "image-1699999999999-123456789.jpg",
        "url": "/uploads/comments/image-1699999999999-123456789.jpg"
      },
      {
        "filename": "image-1699999999999-987654321.jpg",
        "url": "/uploads/comments/image-1699999999999-987654321.jpg"
      }
    ]
  }
}
```

---

## Manejo de Errores

### Error: Tipo de archivo no permitido
```json
{
  "statusCode": 400,
  "message": "Solo se permiten archivos de imagen"
}
```

### Error: Archivo demasiado grande
```json
{
  "statusCode": 413,
  "message": "File too large"
}
```

## Estructura de Carpetas

```
uploads/
├── political-groups/    # Fotos de partidos políticos
├── candidates/          # Fotos de candidatos
├── posts/              # Imágenes de posts
└── comments/           # Imágenes de comentarios
```

## Pruebas con Postman

1. Crea una nueva petición POST
2. Selecciona el endpoint correspondiente (ej: `http://localhost:3000/candidates/1/upload-photo`)
3. Ve a la pestaña "Body"
4. Selecciona "form-data"
5. Agrega una clave llamada `file` (para foto única) o `files` (para múltiples imágenes)
6. Cambia el tipo de "Text" a "File"
7. Selecciona el archivo desde tu computadora
8. Envía la petición

## Acceso a Archivos Subidos

Los archivos subidos están disponibles públicamente en:

```
http://localhost:3000/uploads/{carpeta}/{nombre-archivo}
```

Ejemplo:
```
http://localhost:3000/uploads/candidates/photo-1699999999999-123456789.jpg
```

## Swagger Documentation

Todos los endpoints de subida están documentados en Swagger UI:

```
http://localhost:3000/documentation
```

Busca los endpoints con la etiqueta `@ApiConsumes('multipart/form-data')`.

## Notas Importantes

1. **Nombres únicos**: Los archivos se renombran automáticamente con un timestamp y número aleatorio para evitar colisiones.
2. **Validación**: Solo se aceptan imágenes con extensiones: jpg, jpeg, png, gif, webp.
3. **Límites**:
   - Partidos políticos: 1 foto
   - Candidatos: 1 foto
   - Posts: Hasta 5 imágenes
   - Comentarios: Hasta 3 imágenes
4. **Persistencia**: Los archivos se almacenan en el sistema de archivos local en la carpeta `./uploads/`.
