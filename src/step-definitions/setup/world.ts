import { IWorldOptions, setWorldConstructor, World } from "@cucumber/cucumber";
import { Builder, WebDriver } from "selenium-webdriver";
import { Options } from "selenium-webdriver/chrome";
import { GlobalConfig, GlobalVariables } from "../../env/global";
import { env } from "../../env/parseEnv";
import { stringIsOfOptions } from "../../support/options-helper";

export type Screen = {
  driver: WebDriver;
};

export class ScenarioWorld extends World {
  constructor(options: IWorldOptions) {
    super(options);

    this.globalConfig = options.parameters as GlobalConfig;

    this.globalVariables = {};
  }

  globalConfig: GlobalConfig;

  globalVariables: GlobalVariables;

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
    const automationBrowser = await Promise.resolve(
      env("UI_AUTOMATION_BROWSER")
    );
    const automationBrowsers = ["chrome", "firefox", "safari"];
    const validAutomationBrowser = stringIsOfOptions(
      automationBrowser,
      automationBrowsers
    );
    return validAutomationBrowser;
  };

  // Instance initiation
  // eslint-disable-next-line @typescript-eslint/require-await
  private browserBuilder = async (browser: string): Promise<Builder> => {
    const builder = new Builder();

    switch (browser) {
      case "chrome": {
        const chromeBrowserOptions = new Options();
        chromeBrowserOptions.addArguments(env("BROWSER_ARGUMENTS"));

        return builder
          .forBrowser(browser)
          .withCapabilities(chromeBrowserOptions);
      }

      case "firefox": {
        const firefoxBrowserOptions = new Options();
        firefoxBrowserOptions.addArguments(env("BROWSER_ARGUMENTS"));
        firefoxBrowserOptions.set("acceptInsecureCerts", true);

        return builder
          .forBrowser(browser)
          .withCapabilities(firefoxBrowserOptions);
      }

      default:
        return builder.forBrowser(browser); // Safari has no headless nor parallel support
    }
  };
}

setWorldConstructor(ScenarioWorld);
