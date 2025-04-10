import { When } from "@cucumber/cucumber";
import { ElementKey } from "../env/global";
import { clickElement } from "../support/html-behavior";
import { waitFor, waitForSelector } from "../support/wait-for-behavior";
import { getElementLocator } from "../support/web-element-helper";
import { ScenarioWorld } from "./setup/world";

When(
  /^I (check)?(uncheck)? the "([^"]*)" (?:check box|radio button)$/,
  async function (this: ScenarioWorld, elementKey: ElementKey) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    const elementIdentifier = await getElementLocator(
      driver,
      elementKey,
      globalConfig
    );

    await waitFor(async () => {
      const elementStable = await waitForSelector(driver, elementIdentifier);
      if (elementStable) {
        await clickElement(driver, elementIdentifier);
      }
      return elementStable;
    });
  }
);
