import { Then } from "@cucumber/cucumber";
import {
  ElementKey,
  ElementPosition,
  ExpectedElementText,
  ExpectedElementValue,
  Negate,
} from "../../env/global";
import {
  getElementText,
  getElementTextAtIndex,
  getElementValue,
} from "../../support/html-behavior";
import {
  waitFor,
  waitForSelector,
  waitForSelectorAtIndex,
} from "../../support/wait-for-behavior";
import { getElementLocator } from "../../support/web-element-helper";
import { ScenarioWorld } from "../setup/world";

Then(
  /^The "([^"]*)" should( not)? contain the text "(.*)"$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    exepectedElementText: ExpectedElementText,
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

    await waitFor(async () => {
      const elementStable = await waitForSelector(driver, elementIdentifier);

      if (elementStable) {
        const elementText = await getElementText(driver, elementIdentifier);
        return elementText?.includes(exepectedElementText) === !negate;
      }

      return elementStable;
    });
  }
);

Then(
  /^The "([^"]*)" should( not)? equal the text "(.*)"$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    negate: Negate,
    expectedElementValue: ExpectedElementValue
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
      const elementStable = await waitForSelector(driver, elementIdentifier);

      if (elementStable) {
        const elementAttribute = await getElementText(
          driver,
          elementIdentifier
        );
        return (elementAttribute === expectedElementValue) === !negate;
      }

      return elementStable;
    });
  }
);

Then(
  /^The "([^"]*)" should( not)? contain the value "(.*)"$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    negate: Negate,
    expectedElementValue: ExpectedElementValue
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
      const elementStable = await waitForSelector(driver, elementIdentifier);

      if (elementStable) {
        const elementAttribute = await getElementValue(
          driver,
          elementIdentifier
        );
        return elementAttribute?.includes(expectedElementValue) === !negate;
      }

      return elementStable;
    });
  }
);

Then(
  /^The "([^"]*)" should( not)? equal the value "(.*)"$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    negate: Negate,
    expectedElementValue: ExpectedElementValue
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
      const elementStable = await waitForSelector(driver, elementIdentifier);

      if (elementStable) {
        const elementAttribute = await getElementValue(
          driver,
          elementIdentifier
        );
        return (elementAttribute === expectedElementValue) === !negate;
      }

      return elementStable;
    });
  }
);

Then(
  /^The ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) "([^"]*)" should( not)? contain the text "(.*)"$/,
  async function (
    this: ScenarioWorld,
    elementPosition: ElementPosition,
    elementKey: ElementKey,
    negate: Negate,
    expectedElementText: string
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
      const elementStable = await waitForSelectorAtIndex(
        driver,
        elementIdentifier
      );

      if (elementStable) {
        const elementText = await getElementTextAtIndex(
          driver,
          elementIdentifier,
          elementIndex
        );
        return elementText?.includes(expectedElementText) === !negate;
      }

      return elementStable;
    });
  }
);
