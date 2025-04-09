import { After, Before, setDefaultTimeout } from "@cucumber/cucumber";
import * as fs from "fs";
import { env, envNumber } from "../../env/parseEnv";
import { ScenarioWorld } from "./world";
import { Chalk } from "chalk";

const customChalk = new Chalk({ level: 1 });

setDefaultTimeout(envNumber("SCRIPT_TIMEOUT"));

// Run before each scenario
Before(async function (scenario) {
  const ready = await this.init();

  console.log(
    "- Running scenario " + customChalk.yellow(scenario.pickle.name) + "\n"
  );

  return ready;
});

// Run after each scenario
After(async function (this: ScenarioWorld, scenario) {
  const {
    screen: { driver },
  } = this;

  const scenarioStatus = scenario.result?.status;

  // Take a screenshot after each fail
  if (scenarioStatus === "FAILED") {
    driver.takeScreenshot().then((screenshot) => {
      const buffer = Buffer.from(screenshot, "base64");
      this.attach(buffer, "image/png");

      if (!fs.existsSync(env("SCREENSHOT_PATH"))) {
        fs.mkdirSync(env("SCREENSHOT_PATH"));
      }

      fs.writeFileSync(
        `${env("SCREENSHOT_PATH")}${scenario.pickle.name.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}.png`,
        buffer
      );
    });
  }

  await driver.quit(); // Quit the driver
});
