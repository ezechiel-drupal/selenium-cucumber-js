import { DataTable, Then } from "@cucumber/cucumber";
import { ElementKey, Negate } from "../../env/global";
import { getTableData } from "../../support/html-behavior";
import { waitFor, waitForSelector } from "../../support/wait-for-behavior";
import { getElementLocator } from "../../support/web-element-helper";
import { ScenarioWorld } from "../setup/world";

Then(
  /^The "([^"]*)" table should( not)? equal the following:$/,
  async function (
    this: ScenarioWorld,
    elementKey: ElementKey,
    negate: Negate,
    dataTable: DataTable
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
        const tableData = await getTableData(driver, elementIdentifier);
        return (tableData === dataTable.raw().toString()) === !negate;
      }
    });
  }
);
