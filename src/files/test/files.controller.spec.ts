import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from '../files.controller';
import { FilesService } from '../files.service';
import { mockFileUploadedStub, mockMulterFileStub } from './stubs/mockDatas';
import { FilesService as MockFilesService } from '../__mocks__/files.service';

import * as fs from 'fs';
import * as path from 'path';
import { MicroserviceResponseWrapper } from '../data/microservice-response.wrapper';

describe('FilesController', () => {
  let controller: FilesController;
  let service: FilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useClass: MockFilesService,
        },
      ],
    }).compile();

    controller = module.get<FilesController>(FilesController);
    service = module.get<FilesService>(FilesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    const mockFiles: Express.Multer.File[] = [mockMulterFileStub()];
    const mockFolder = 'boards';
    const destinationPath = path.join(process.env.PWD, 'uploads');
    let response: MicroserviceResponseWrapper;

    beforeEach(async () => {
      response = await controller.uploadFile(mockFiles);
    });

    test('then destinatino directory should be exist', () => {
      const targetPath = path.join(destinationPath, 'boards');
      const dir = fs.existsSync(targetPath);
      expect(dir).toEqual(true);
    });

    test('then service.uploadFile is called', () => {
      expect(service.uploadFile).toBeCalledWith(mockFiles, mockFolder);
    });

    test('then it should returns a value', () => {
      expect(response.result).toEqual(mockFileUploadedStub());
    });
  });
});
