# NestJS File Interceptor on NestJS/Microservice Environment

* RpcFilesInterceptor is located at src/common/rpc-files

* Files will be stored on uploads/...

  - if there is no uploads folder, it will be created when file upload requests comes from other microservice.

* You can set the folder name when you bind interceptor on class(or method), `@UseInterceptors(RpcFilesInterceptor('files', 10, multerOptions({{ _dir }})))`
  - Then the file will be stored under `uploads/_dir/{{ filename }}`
  - The \_dir will be created if it is not exist.
  - As you can see below, there are `uploads/board` dir.
<img width="443" alt="스크린샷 2023-03-10 오후 12 34 40" src="https://user-images.githubusercontent.com/65178775/224216781-3af2edab-ed6a-4c6c-894e-e594169e6755.png">
