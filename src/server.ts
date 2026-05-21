import app from "./app.js";
import config from "./config/index.js";

const main = () => {
  app.listen(config.port, () => {
    console.log(`app listening on port ${config.port}`);
  });
};

main();
