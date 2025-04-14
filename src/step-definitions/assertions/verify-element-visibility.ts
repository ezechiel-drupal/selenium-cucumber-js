import { Then } from "@cucumber/cucumber";
import { ElementKey, Negate } from "../../env/global";
import {
  elementDisplayed,
  elementDisplayedAtIndex,
  elementEnabled,
  getElementsByCssSelector,
} from "../../support/html-behavior";
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

Then(
  /^The ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) "([^"]*)" should( not)? be displayed$/,
  async function (
    this: ScenarioWorld,
    elementPosition: string,
    elementKey: ElementKey,
    negate: Negate
  ) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    const elementIdentifier = await getElementLocator(
      driver,
      elementKey,
      globalConfig
    );

    const index = Number(elementPosition.match(/\d/g)?.join("")) - 1;

    await waitFor(async () => {
      const isElementVisible = await elementDisplayedAtIndex(
        driver,
        elementIdentifier,
        index
      );
      return isElementVisible === !negate;
    });
  }
);

Then(
  /^I should( not)? see (\d*) "([^"]*)" displayed$/,
  async function (
    this: ScenarioWorld,
    negate: Negate,
    count: string,
    elementKey: ElementKey
  ) {
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
      const elements = await getElementsByCssSelector(
        driver,
        elementIdentifier
      );
      return (Number(count) === elements.length) === !negate;
    });
  }
);
