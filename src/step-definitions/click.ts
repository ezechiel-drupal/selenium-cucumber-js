import { When } from "@cucumber/cucumber";
import { ElementKey, ElementPosition } from "../env/global";
import {
  clickElement,
  clickElementAtIndex,
  clickElementWithText,
} from "../support/html-behavior";
import {
  waitFor,
  waitForSelector,
  waitForSelectors,
  waitForSelectorWithText,
} from "../support/wait-for-behavior";
import { getElementLocator } from "../support/web-element-helper";
import { ScenarioWorld } from "./setup/world";

When(
  /^I click the "([^"]*)" (?:button|link)$/,
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

When(
  /^I click the ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) "([^"]*)" (?:button|link)$/,
  async function (
    this: ScenarioWorld,
    elementPosition: ElementPosition,
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

    const elementIndex = Number(elementPosition.match(/\d/g)?.join("")) - 1;

    await waitFor(async () => {
      const elementStable = await waitForSelectors(driver, elementIdentifier);
      if (elementStable) {
        await clickElementAtIndex(driver, elementIdentifier, elementIndex);
      }
      return elementStable;
    });
  }
);

When(
  /^I click the element with text "([^"]*)"$/,
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
      const elementStable = await waitForSelectorWithText(
        driver,
        elementIdentifier
      );
      if (elementStable) {
        await clickElementWithText(driver, elementIdentifier);
      }
      return elementStable;
    });
  }
);
