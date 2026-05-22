import app from "./app.js";
import config from "./config/index.js";
import { initDB } from "./db/index.js";

const main = () => {
  app.listen(config.port, () => {
    initDB();
    console.log(`app listening on port ${config.port}`);
  });
};

main();
