import { Then } from "@cucumber/cucumber";
import { expect } from "chai";
import { By } from "selenium-webdriver";
import { ScenarioWorld } from "../setup/world";

Then(
  /^The "([^"]*)" should contain the text "(.*)"$/,
  async function (
    this: ScenarioWorld,
    elementKey: string,
    exepectedElementText: string
  ) {
    const {
      screen: { driver },
    } = this;

    console.log(
      `The ${elementKey} should contain the text ${exepectedElementText}`
    );

    const element = await driver.findElement(By.id("dev-partners"));
    const elementText = await element.getAttribute("innerText");
    expect(elementText).to.contain(exepectedElementText);
  }
);

Then(
  /^The "([^"]*)" should be displayed$/,
  async function (this: ScenarioWorld, elementKey: string) {
    const {
      screen: { driver },
    } = this;

    console.log(`The ${elementKey} should be displayed`);

    const element = await driver.findElement(By.id("selenium_webdriver"));
    const elementDisplayed = await element.isDisplayed();
    expect(elementDisplayed).to.be.true;
  }
);
