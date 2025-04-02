import { Given, When, Then } from "@cucumber/cucumber";
import { ScenarioWorld } from "./setup/world";

Given(
  /^I am on the "([^"]*)" page$/,
  async function (this: ScenarioWorld, pageId: String) {
    const {
      screen: { driver },
    } = this;

    console.log(`I am on the ${pageId} page`);
    await driver.get("https://www.selenium.dev/");
  }
);
