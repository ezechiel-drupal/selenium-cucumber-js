import { Given } from "@cucumber/cucumber";
import { ScenarioWorld } from "./setup/world";
import { PageId } from "../env/global";
import {
  currentPathMatchesPageId,
  reloadPage,
} from "../support/navigation-behavior";
import { navigateToPage } from "../support/navigation-behavior";
import { waitFor } from "../support/wait-for-behavior";

Given(
  /^I am on the "([^"]*)" page$/,
  async function (this: ScenarioWorld, pageId: PageId) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    await navigateToPage(driver, pageId, globalConfig);

    await waitFor(() => currentPathMatchesPageId(driver, pageId, globalConfig));
  }
);

Given(
  /^I am directed to the "([^"]*)" page$/,
  async function (this: ScenarioWorld, pageId: PageId) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    await waitFor(() => currentPathMatchesPageId(driver, pageId, globalConfig));
  }
);

Given(
  /^I refresh the "([^"]*)" page$/,
  async function (this: ScenarioWorld, pageId: PageId) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    await reloadPage(driver);

    await waitFor(
      () => currentPathMatchesPageId(driver, pageId, globalConfig),
      {
        timeout: 30000,
      }
    );
  }
);
