import { Then } from "@cucumber/cucumber";
import { ElementKey, IframeKey, InputValue } from "../env/global";
import { getElementLocator } from "../support/web-element-helper";
import { ScenarioWorld } from "./setup/world";
import {
  waitFor,
  waitForSelector,
  waitForSelectorInIframe,
} from "../support/wait-for-behavior";
import { inputElementValue } from "../support/html-behavior";

Then(
  /^I fill in the "([^"]*)" input on the "([^"]*)" iframe with "([^"]*)"$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    iframeKey: IframeKey,
    inputValue: InputValue
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
          await inputElementValue(driver, elementIdentifier, inputValue);
        } else {
          return elementStable;
        }
      } else {
        return iframeStable;
      }
    });
  }
);
