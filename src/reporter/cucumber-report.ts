import reporter, { Options } from "cucumber-html-reporter";
import { env } from "../env/parseEnv";
import dotenv from "dotenv";

dotenv.config({ path: env("COMMON_CONFIG_FILE") });

export const options: Options = {
  theme: "bootstrap",
  jsonFile: env("JSON_REPORT_FILE"),
  output: env("HTML_REPORT_FILE"),
  reportSuiteAsScenarios: false,
  screenshotsDirectory: env("SCREENSHOT_PATH"),
  storeScreenshots: false,
  launchReport: false,
  name: "Rapport des tests [NEGE]",
  brandTitle: "Tests de non-régression",
  scenarioTimestamp: true,
  columnLayout: 1,
};

reporter.generate(options);
