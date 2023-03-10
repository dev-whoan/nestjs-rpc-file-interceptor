import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class FilesService {
  private logger = new Logger('FilesService');

  async uploadFile(
    files: Express.Multer.File[],
    folder: string,
  ): Promise<object[] | number> {
    //* 업로드 된 파일 이름 획득
    try {
      const saveResult: object[] = [];
      files.forEach(async (file, index) => {
        const originalName = file.originalname;
        const newName = Date.now().toString();
        const destination = path.join(process.env.PWD, `uploads/${folder}`);
        const newFileName = newName + path.extname(originalName);

        const oneFile = {
          originalName,
          filePath: destination,
          fileName: newFileName,
        };

        saveResult.push(oneFile);

        //* db 저장
      });

      return saveResult;
    } catch (err) {
      this.logger.error(`Error Occured While uploadFile`, err.stack || err);

      return HttpStatus.BAD_REQUEST;
    }
  }
}
