import {
  CallHandler,
  ExecutionContext,
  Inject,
  Logger,
  mixin,
  NestInterceptor,
  Optional,
  Type,
} from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import * as multer from 'multer';
import { map, Observable } from 'rxjs';
import * as path from 'path';
import * as fs from 'fs';
import { Stream } from 'stream';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const MULTER_MODULE_OPTIONS = 'MULTER_MODULE_OPTIONS';
type MulterInstance = any;

interface fileResult {
  success: boolean;
  originalName: string;
  fileName: string;
  filePath: string;
  size: number;
}

export function RpcFilesInterceptor(
  fieldName: string,
  maxCount?: number,
  localOptions?: MulterOptions,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    private logger = new Logger('RpcFilesInterceptor');
    protected multer: MulterInstance;

    constructor(
      @Optional()
      @Inject(MULTER_MODULE_OPTIONS)
      options: MulterModuleOptions = {},
    ) {
      this.multer = (multer as any)({
        ...options,
        ...localOptions,
      });
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToRpc();
      const rpcData = ctx.getData();
      const userId = rpcData.userid;
      const uploadedArray = [];

      //* get destination from multerOptions

      await new Promise<void>((resolve, reject) => {
        const resolveCount = rpcData.files.length;
        let currentCount = 0;
        rpcData.files.forEach(async (file, index) => {
          const newName = Date.now().toString();
          const buf = Buffer.from(file.buffer);

          let destination: string, filename: string;
          localOptions.storage.getDestination(null, null, (err, data) => {
            if (err) {
              this.logger.error(err.stack || err);
              return;
            }

            this.logger.debug(`storageCallback.getDestination [${data}]`);
            destination = data;
          });
          localOptions.storage.getFilename(null, file, (err, data) => {
            if (err) {
              this.logger.error(err.stack || err);
              return;
            }

            this.logger.debug(`storageCallback.getFilename [${data}]`);
            filename = data;
          });

          const newFileName = newName + path.extname(filename);
          const finalPath = path.join(destination, newFileName);
          this.logger.debug(finalPath);
          try {
            const outStream = fs.createWriteStream(finalPath);
            const bufferStream = new Stream.PassThrough();
            bufferStream.end(buf);
            bufferStream.pipe(outStream);
            // outStream.write(buf);

            outStream.on('error', (err) => {
              this.logger.error(err.stack || err);
              reject(err);
            });

            outStream.on('finish', () => {
              uploadedArray.push({
                success: true,
                originalName: filename,
                fileName: newName,
                filePath: finalPath,
                size: outStream.bytesWritten,
              } as fileResult);
              if (++currentCount >= resolveCount) {
                resolve();
              }
            });
          } catch (err) {
            this.logger.error(err.stack || err);
            reject(err);
          }
        });
      });

      return next
        .handle()
        .pipe(map((data) => ({ ...data, result: uploadedArray })));
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor;
}
