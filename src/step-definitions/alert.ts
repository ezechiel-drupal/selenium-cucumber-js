import {
  clickAcceptOnDialog,
  clickDismissOnDialog,
} from "../support/html-behavior";
import { ScenarioWorld } from "./setup/world";
import { When } from "@cucumber/cucumber";

When(
  /^I click (accept)?(dismiss)? on the alert dialog$/,
  async function (this: ScenarioWorld, dismissDialog: boolean) {
    const {
      screen: { driver },
    } = this;

    await driver.switchTo().alert().accept();

    if (dismissDialog) {
      await clickDismissOnDialog(driver);
    } else {
      await clickAcceptOnDialog(driver);
    }
  }
);
