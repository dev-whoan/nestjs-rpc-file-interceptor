import { mockFileUploadedStub } from '../test/stubs/mockDatas';

export const FilesService = jest.fn().mockReturnValue({
  uploadFile: jest.fn().mockResolvedValue(mockFileUploadedStub()),
});
