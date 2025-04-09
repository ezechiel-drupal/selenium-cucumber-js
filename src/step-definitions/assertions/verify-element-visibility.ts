import { Then } from "@cucumber/cucumber";
import { ElementKey } from "../../env/global";
import { elementDisplayed } from "../../support/html-behavior";
import { waitFor } from "../../support/wait-for-behavior";
import { getElementLocator } from "../../support/web-element-helper";
import { ScenarioWorld } from "../setup/world";

Then(
  /^The "([^"]*)" should be displayed$/,
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
      const isElementVisible = await elementDisplayed(
        driver,
        elementIdentifier
      );
      return isElementVisible;
    });
  }
);
