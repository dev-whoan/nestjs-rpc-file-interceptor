import { Controller, Get, HttpStatus, UseInterceptors } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { multerOptions } from 'src/common/rpc-files/multer/multer.options';
import { RpcFilesInterceptor } from 'src/common/rpc-files/rpc-files.interceptor';
import { MicroserviceResponseWrapper } from './data/microservice-response.wrapper';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  private readonly redisPrefixKey = 'file';
  constructor(private readonly fileService: FilesService) {}

  @MessagePattern({ cmd: 'create_file' })
  @UseInterceptors(RpcFilesInterceptor('files', 10, multerOptions('boards')))
  async uploadFile(
    @Payload('files') files: Express.Multer.File[],
  ): Promise<MicroserviceResponseWrapper> {
    const fileInfoResult = await this.fileService.uploadFile(files, 'boards');

    if (typeof fileInfoResult === 'number') {
      return {
        success: false,
        code: fileInfoResult,
      };
    }

    const success = fileInfoResult !== null;
    const code = success
      ? HttpStatus.CREATED
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const result = fileInfoResult;

    return {
      success,
      code,
      result,
    };
  }
}
