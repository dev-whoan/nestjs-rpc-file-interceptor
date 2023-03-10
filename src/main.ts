import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

class MicroApplication {
  static instance: MicroApplication;
  private logger = new Logger('');
  private DEV_MODE: boolean;
  private PORT: string;
  private corsOriginList: string[];

  constructor(private server: NestExpressApplication) {
    if (MicroApplication.instance) return MicroApplication.instance;
    this.server = server;

    this.DEV_MODE = process.env.NODE_ENV === 'production' ? false : true;
    this.PORT = process.env.PORT || '3000';

    MicroApplication.instance = this;
  }

  async boostrap() {
    this.server.connectMicroservice({
      transport: Transport.TCP,
      options: {
        port: this.PORT,
      },
    });
    await this.server.startAllMicroservices();
    await this.server.listen(this.PORT);
  }

  startLog() {
    if (this.DEV_MODE) {
      this.logger.log(`✅ Server on http://localhost:${this.PORT}`);
    } else {
      this.logger.log(`✅ Server on port ${this.PORT}...`);
    }
  }

  errorLog(error: string) {
    this.logger.error(`🆘 Server error ${error}`);
  }
}

async function init(): Promise<void> {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new MicroApplication(server);
  await app.boostrap();
  app.startLog();
}

init().catch((error) => {
  new Logger('init').error(error);
});
