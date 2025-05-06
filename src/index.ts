import dotenv from "dotenv";
import {
  GlobalConfig,
  HostsConfig,
  PagesConfig,
  PageElementMappings,
} from "./env/global";
import { env, getJsonFromFile } from "./env/parseEnv";
import * as fs from "fs";
import { Chalk } from "chalk";

const chalk = new Chalk({ level: 1 });

// Pointing to environment variables
dotenv.config({ path: env("COMMON_CONFIG_FILE") });

const hostsConfig: HostsConfig = getJsonFromFile(env("HOSTS_URLS_PATH"));
const pagesConfig: PagesConfig = getJsonFromFile(env("PAGES_URLS_PATH"));
const mappingFiles = fs.readdirSync(
  `${process.cwd()}${env("PAGE_ELEMENTS_PATH")}`
);

const pageElementMappings: PageElementMappings = mappingFiles.reduce(
  (pageElementConfigAcc: object, file: string) => {
    const key = file.replace(".json", "");
    const elementMappings = getJsonFromFile(
      `${env("PAGE_ELEMENTS_PATH")}${file}`
    );
    return { ...pageElementConfigAcc, [key]: elementMappings };
  },
  {}
);

const worldParameters: GlobalConfig = {
  hostsConfig,
  pagesConfig,
  pageElementMappings,
};

// Configuration of cucumber's behavior
const common = `./src/features/**/*.feature \
  --require-module ts-node/register \
  --require ./src/step-definitions/**/**/*.ts \
  --world-parameters ${JSON.stringify(worldParameters)} \
  --format summary \
  --format html:./reports/report.html \
  --format json:./reports/report.json \
  --format usage-json:./reports/usage.json \
  --parallel ${env("PARALLEL")} \
  --retry ${env("RETRY")}`;

// Available testing processes
const dev = `${common} --tags '@dev'`;
const smoke = `${common} --tags '@smoke'`;
const regression = `${common} --tags '@regression'`;

console.log(chalk.bold.dim("\nRequesting cucumber...\n"));

export { dev, regression, smoke };
