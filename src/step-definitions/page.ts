import { Then } from "@cucumber/cucumber";
import {
  ElementKey,
  ExpectedElementText,
  InputValue,
  Negate,
  PagePosition,
} from "../env/global";
import { getElementText, inputElementValue } from "../support/html-behavior";
import { waitFor, waitForSelectorOnPage } from "../support/wait-for-behavior";
import { getElementLocator } from "../support/web-element-helper";
import { ScenarioWorld } from "./setup/world";

Then(
  /^I fill in the "([^"]*)" input on the ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) (?:tab|window) with "([^"]*)"$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    pagePosition: PagePosition,
    inputValue: InputValue
  ) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    const pageIndex = Number(pagePosition.match(/\d/g)?.join("")) - 1;

    const elementIdentifier = await getElementLocator(
      driver,
      elementKey,
      globalConfig
    );

    await waitFor(async () => {
      const elementStable = await waitForSelectorOnPage(
        driver,
        elementIdentifier,
        pageIndex
      );

      if (elementStable) {
        await inputElementValue(driver, elementIdentifier, inputValue);
      }
      return elementStable;
    });
  }
);

Then(
  /^The "([^"]*)" on the ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) tab should( not)? be displayed$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    pagePosition: PagePosition,
    negate: Negate
  ) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    const pageIndex = Number(pagePosition.match(/\d/g)?.join("")) - 1;

    const elementIdentifier = await getElementLocator(
      driver,
      elementKey,
      globalConfig
    );

    await waitFor(async () => {
      const isElementVisible = await waitForSelectorOnPage(
        driver,
        elementIdentifier,
        pageIndex
      );
      return isElementVisible === !negate;
    });
  }
);

Then(
  /^The "([^"]*)" on the ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) tab should( not)? contain the text "(.*)"$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    pagePosition: PagePosition,
    negate: Negate,
    expectedElementText: ExpectedElementText
  ) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    const pageIndex = Number(pagePosition.match(/\d/g)?.join("")) - 1;

    const elementIdentifier = await getElementLocator(
      driver,
      elementKey,
      globalConfig
    );

    await waitFor(async () => {
      const elementStable = await waitForSelectorOnPage(
        driver,
        elementIdentifier,
        pageIndex
      );

      if (elementStable) {
        const elementText = await getElementText(driver, elementIdentifier);
        return elementText?.includes(expectedElementText) === !negate;
      }

      return elementStable;
    });
  }
);

Then(
  /^The "([^"]*)" on the ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) tab should( not)? equal the text "(.*)"$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    pagePosition: PagePosition,
    negate: Negate,
    expectedElementText: ExpectedElementText
  ) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    const pageIndex = Number(pagePosition.match(/\d/g)?.join("")) - 1;

    const elementIdentifier = await getElementLocator(
      driver,
      elementKey,
      globalConfig
    );

    await waitFor(async () => {
      const elementStable = await waitForSelectorOnPage(
        driver,
        elementIdentifier,
        pageIndex
      );

      if (elementStable) {
        const elementText = await getElementText(driver, elementIdentifier);
        return (elementText === expectedElementText) === !negate;
      }

      return elementStable;
    });
  }
);
