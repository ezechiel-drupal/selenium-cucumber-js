import { Then } from "@cucumber/cucumber";
import { ElementKey, IframeKey, Negate } from "../../env/global";
import { elementDisplayed, getElementText } from "../../support/html-behavior";
import {
  waitFor,
  waitForSelector,
  waitForSelectorInIframe,
} from "../../support/wait-for-behavior";
import { getElementLocator } from "../../support/web-element-helper";
import { ScenarioWorld } from "../setup/world";

Then(
  /^The "([^"]*)" on the "([^"]*)" iframe should( not)? be displayed$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    iframeKey: IframeKey,
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

    const iframeIdentifier = await getElementLocator(
      driver,
      iframeKey,
      globalConfig
    );

    await waitFor(async () => {
      const iframeStable = await waitForSelector(driver, iframeIdentifier);
      if (iframeStable) {
        const elementStable = await waitForSelectorInIframe(
          driver,
          iframeIdentifier,
          elementIdentifier
        );

        if (elementStable) {
          const isElementVisible = await elementDisplayed(
            driver,
            elementIdentifier
          );
          return isElementVisible === !negate;
        } else {
          return elementStable;
        }
      } else {
        return iframeStable;
      }
    });
  }
);

Then(
  /^The "([^"]*)" on the "([^"]*)" iframe should( not)? contain the text "(.*)"$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    iframeKey: IframeKey,
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

    const iframeIdentifier = await getElementLocator(
      driver,
      iframeKey,
      globalConfig
    );

    await waitFor(async () => {
      const iframeStable = await waitForSelector(driver, iframeIdentifier);

      if (iframeStable) {
        const elementStable = await waitForSelectorInIframe(
          driver,
          iframeIdentifier,
          elementIdentifier
        );

        if (elementStable) {
          const elementText = await getElementText(driver, elementIdentifier);
          return elementText?.includes(expectedElementText) === !negate;
        }
      }
    });
  }
);

Then(
  /^The "([^"]*)" on the "([^"]*)" iframe should( not)? equal the text "(.*)"$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    iframeKey: IframeKey,
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

    const iframeIdentifier = await getElementLocator(
      driver,
      iframeKey,
      globalConfig
    );

    await waitFor(async () => {
      const iframeStable = await waitForSelector(driver, iframeIdentifier);

      if (iframeStable) {
        const elementStable = await waitForSelectorInIframe(
          driver,
          iframeIdentifier,
          elementIdentifier
        );

        if (elementStable) {
          const elementText = await getElementText(driver, elementIdentifier);
          return (elementText === expectedElementText) === !negate;
        }
      }
    });
  }
);
