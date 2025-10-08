import { app } from './app';
import { AppDataSource } from './database/data-source.js';

async function bootstrap() {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.error('DB error', error);
    process.exit(1);
  }
}

app.listen(
  {
    port: process.env.PORT || 3000,
  },
  () => {
    console.log('Server running');
  },
);
bootstrap();
