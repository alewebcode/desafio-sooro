import { app } from "./app.js";
import { DatabaseConfig } from "./database/data-source.js";

async function bootstrap() {
  try {
    await DatabaseConfig.initialize();
  } catch (error) {
    console.error("DB error", error);
    process.exit(1);
  }
}

app.listen(
  {
    port: process.env.PORT,
  },
  () => {
    console.log("Server running");
  }
);
