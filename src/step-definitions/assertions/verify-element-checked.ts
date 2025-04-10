import { Then } from "@cucumber/cucumber";
import { ElementKey, Negate } from "../../env/global";
import { elementChecked } from "../../support/html-behavior";
import { waitFor, waitForSelector } from "../../support/wait-for-behavior";
import { getElementLocator } from "../../support/web-element-helper";
import { ScenarioWorld } from "../setup/world";

Then(
  /^The "([^"]*)" (?:check box|radio button) should( not)? be checked$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, negate: Negate) {
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
        const isElementChecked = await elementChecked(
          driver,
          elementIdentifier
        );
        return isElementChecked === !negate;
      }

      return elementStable;
    });
  }
);
