export const mockFileUploadedStub = () => {
  return {
    originalName: 'test-originalname',
    filePath: 'test-filepath',
    fileName: 'test-filename',
  };
};

export const mockMulterFileStub = (): Express.Multer.File => {
  return {
    fieldname: 'test-fieldname',
    originalname: 'test-originalname',
    encoding: '7bit',
    mimetype: 'image/png',
    size: 86448,
    stream: null,
    destination: 'test-destination',
    filename: 'test-filename',
    path: 'test-filepath',
    buffer: Buffer.from('test-buffer'),
  };
};
