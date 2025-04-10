import { Then } from "@cucumber/cucumber";
import { ElementKey, Negate } from "../../env/global";
import { elementDisplayed, elementEnabled } from "../../support/html-behavior";
import { waitFor, waitForSelector } from "../../support/wait-for-behavior";
import { getElementLocator } from "../../support/web-element-helper";
import { ScenarioWorld } from "../setup/world";

Then(
  /^The "([^"]*)" should( not)? be displayed$/,
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
      const isElementVisible = await elementDisplayed(
        driver,
        elementIdentifier
      );
      return isElementVisible === !negate;
    });
  }
);

Then(
  /^The "([^"]*)" should( not)? be enabled$/,
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
        const isElementEnabled = await elementEnabled(
          driver,
          elementIdentifier
        );
        return isElementEnabled === !negate;
      }

      return elementStable;
    });
  }
);
