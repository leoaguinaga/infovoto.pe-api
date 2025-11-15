import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class UploadService {
  /**
   * Obtiene la configuración de Multer para almacenar archivos
   * @param folder Carpeta dentro de uploads donde se guardarán los archivos
   */
  getMulterOptions(folder: string) {
    return {
      storage: diskStorage({
        destination: `./uploads/${folder}`,
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        // Aceptar solo imágenes
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new Error('Solo se permiten archivos de imagen'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    };
  }

  /**
   * Construye la URL pública del archivo
   * @param folder Carpeta donde se guardó el archivo
   * @param filename Nombre del archivo
   */
  getFileUrl(folder: string, filename: string): string {
    return `/uploads/${folder}/${filename}`;
  }
}
