import { When } from "@cucumber/cucumber";
import { ElementKey, GlobalVariableKey } from "../env/global";
import { getElementText } from "../support/html-behavior";
import { waitFor, waitForSelector } from "../support/wait-for-behavior";
import { getElementLocator } from "../support/web-element-helper";
import { ScenarioWorld } from "./setup/world";

When(
  /^I retrieve the "([^"]*)" text and store it as "([^"]*)" in global variables$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    globalVariableKey: GlobalVariableKey
  ) {
    const {
      screen: { driver },
      globalVariables,
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
        const elementText = await getElementText(driver, elementIdentifier);

        if (elementText != null) {
          globalVariables[globalVariableKey] = elementText;
        }
      }
    });
  }
);
