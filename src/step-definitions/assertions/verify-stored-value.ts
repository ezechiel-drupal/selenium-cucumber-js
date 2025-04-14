import { Then } from "@cucumber/cucumber";
import { ElementKey, GlobalVariableKey, Negate } from "../../env/global";
import { getElementText } from "../../support/html-behavior";
import { waitFor, waitForSelector } from "../../support/wait-for-behavior";
import { getElementLocator } from "../../support/web-element-helper";
import { ScenarioWorld } from "../setup/world";

Then(
  /^The "([^"]*)" should( not)? equal the "([^"]*)" stored in global variables$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    negate: Negate,
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
      const variableText = globalVariables[globalVariableKey];

      if (elementStable) {
        const elementText = await getElementText(driver, elementIdentifier);
        return (elementText === variableText) === !negate;
      }

      return elementStable;
    });
  }
);

Then(
  /^The "([^"]*)" should( not)? contain the "([^"]*)" stored in global variables$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    negate: Negate,
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
      const variableText = globalVariables[globalVariableKey];

      if (elementStable) {
        const elementText = await getElementText(driver, elementIdentifier);
        return elementText?.includes(variableText) === !negate;
      }

      return elementStable;
    });
  }
);
