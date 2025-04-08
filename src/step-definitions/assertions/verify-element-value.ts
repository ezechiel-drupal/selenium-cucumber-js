import { Then } from "@cucumber/cucumber";
import { ElementKey, ExpectedElementText } from "../../env/global";
import { getElementText } from "../../support/html-behavior";
import { waitFor } from "../../support/wait-for-behavior";
import { getElementLocator } from "../../support/web-element-helper";
import { ScenarioWorld } from "../setup/world";

Then(
  /^The "([^"]*)" should contain the text "(.*)"$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    exepectedElementText: ExpectedElementText
  ) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    console.log(
      `The ${elementKey} should contain the text ${exepectedElementText}`
    );

    const elementIdentifier = await getElementLocator(
      driver,
      elementKey,
      globalConfig
    );

    await waitFor(async () => {
      const elementText = await getElementText(driver, elementIdentifier);
      return elementText?.includes(exepectedElementText);
    });
  }
);
