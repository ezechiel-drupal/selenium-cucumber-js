import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import { Builder, WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import { browserArguments, testBrowser } from "../../../env/environment.json";
import { stringIsOfOptions } from "../../support/options-helper";

export type Screen = {
  driver: WebDriver;
};

export class ScenarioWorld extends World {
  constructor(options: IWorldOptions) {
    super(options);
  }

  screen!: Screen;

  async init(): Promise<Screen> {
    const browser = await this.newBrowser();
    const browserBuilder = await this.browserBuilder(browser);
    const driver = browserBuilder.build();
    await driver.manage().window().maximize();

    this.screen = { driver };

    return this.screen;
  }

  // Choosing the browser
  private newBrowser = async (): Promise<string> => {
    const automationBrowser = testBrowser;
    const automationBrowsers = ["chrome", "firefox", "safari"]; // Safari has no headless nor parallel support
    const validAutomationBrowser = stringIsOfOptions(
      automationBrowser,
      automationBrowsers
    );
    return validAutomationBrowser;
  };

  // Instance initiation
  private browserBuilder = async (browser: string): Promise<Builder> => {
    console.log(`\n  Executing on ${browser} browser :`);

    const builder = new Builder();

    switch (browser) {
      case "chrome":
        const chromeBrowserOptions = new Options();
        chromeBrowserOptions.addArguments(...browserArguments);

        return builder
          .forBrowser(browser)
          .withCapabilities(chromeBrowserOptions);

      case "firefox":
        const firefoxBrowserOptions = new Options();
        firefoxBrowserOptions.addArguments(...browserArguments);
        firefoxBrowserOptions.set("acceptInsecureCerts", true);

        return builder
          .forBrowser(browser)
          .withCapabilities(firefoxBrowserOptions);

      default:
        return builder.forBrowser(browser);
    }
  };
}

setWorldConstructor(ScenarioWorld);
