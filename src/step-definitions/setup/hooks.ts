import { After, Before } from "@cucumber/cucumber";
import * as fs from "fs";
import { ScenarioWorld } from "./world";

// Run before each scenario
Before(async function (scenario) {
  console.log(`Running scenario ${scenario.pickle.name}`);

  const ready = await this.init();
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
    const path = `reports/failure-screenshots/${scenario.gherkinDocument.feature?.name}`;

    driver.takeScreenshot().then((screenshot) => {
      fs.mkdirSync(`${path}`, {
        recursive: true,
      });
      fs.writeFileSync(
        `${path}/${scenario.pickle.id}.png`,
        screenshot,
        "base64"
      );
    });
  }

  await driver.quit(); // Quit the driver
});
