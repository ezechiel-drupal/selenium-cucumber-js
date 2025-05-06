# Actency test framework

This test framework is based on the [Cucumber-JS](https://github.com/cucumber/cucumber-js) and its [Gherkin](https://cucumber.io/docs/gherkin/reference/) language. It uses the [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/) API to automate browser interactions following scripts written in [TypeScript](https://www.typescriptlang.org/) then transpiled to JavaScript. It uses two main internal libraries : `actions` and `assertions`. Its architecture aim to be flexible and reusable by every tester.

In best cases, the tester should only have to write a `.feature` file, indicate the website being tested, its tested pages' routes and its necessary DOM elements for the test. However, the current libraries may lack of some functions for you test cases. If so, you will have to implement them yourself into one of those librairies following the documentation.

## Table of contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [About Gherkin](#about-gherkin)
- [About the World class](#about-the-world-class)
- [Runtime process](#runtime-process)
- [Creating a new test suite](#creating-a-new-test-suite)
  - [Writing a feature file](#writing-a-feature-file)
  - [Steps libraries](#steps-libraries)
    - [Actions](#actions)
    - [Assertions](#assertions)
- [What's happening under the hood ?](#whats-happening-under-the-hood-)
  - [The index.ts file](#the-indexts-file)
  - [The .feature file](#the-feature-file)
  - [The hooks](#the-hooks)
    - [Before](#before)
    - [After](#after)
- [Implementing your own step](#implementing-your-own-step)
  - [The step functions](#the-step-functions)
  - [The test functions](#the-test-functions)
    - [Using the world properties](#using-the-world-properties)
    - [Using the helper functions](#using-the-helper-functions)
    - [Waiting strategy](#waiting-strategy)
    - [Using the page element mappings](#using-the-page-element-mappings)
- [Capitalizing the knowledge](#capitalizing-the-knowledge)

## Prerequisites and installation

## Prerequisites

- Node.js
- pnpm
- Git

## Installation

Once you've retrieved this code repository, install all dependencies with

```bash
pnpm install
```

Try to run the current test suite with `pnpm test:dev`

```
pnpm test:dev
```

You should see the following output in your console :

```
Failures:

1) Scenario: As a user I expect to be able to see the important stuff # src/features/home-page.feature:13
   ✔ Before # src/step-definitions/setup/hooks.ts:14
   ✔ Given I am on the "home" page # src/step-definitions/navigation.ts:11
   ✖ Then The "copyright section" should be displayed # src/step-definitions/assertions/verify-element-visibility.ts:13
       Error: Unable to find the copyright section mapping
           at getElementLocator (/Users/odinasgard/Desktop/selenium-cucumber-js/src/support/web-element-helper.ts:19:11)
           at processTicksAndRejections (node:internal/process/task_queues:105:5)
           at async ScenarioWorld.<anonymous> (/Users/odinasgard/Desktop/selenium-cucumber-js/src/step-definitions/assertions/verify-element-visibility.ts:21:31)
   ✔ After # src/step-definitions/setup/hooks.ts:25
       Attachment (image/png)

2 scenarios (1 failed, 1 passed)
4 steps (1 failed, 3 passed)
0m08.599s (executing steps: 0m08.559s)
```

Now look at the generated reports in the `/reports` folder. You should see the following files :

- `report.html`
- `report.json`
- `usage.json`

Open the `report.html` file in your browser to see the tests results.

## About Gherkin

The Gherkin syntax relies on the notion of **_natural language_** to describe the steps of a test scenario. The natural language is about three main keywords : `Given`, `When` and `Then`.

Example of a scenario written in Gherkin :

```gherkin
Feature: As a user, I should be able to navigate to the home page

  @dev @smoke @regression
  Scenario: As a user, I should be able to see the webdriver logo

    Given I am on the "about" page
    And I click on the "selenium logo"
    When I am directed to the "home" page
    Then The "webdriver logo" should be displayed
    But The "header" shouldn't contain the text "About"
```

- `Given` describe the intial context.
- `When`describe an event or an action.
- `Then` describe an expected outcome, or result.

Secondary keyword may be used to add elements of context, action or result :

- `And` add a condition to `Given`, `When` or `Then`.
- `But` exclude a condition to `Given`, `When` or `Then`.

Each step of the scenario matches a unique typescript function via RegExp pattern. For example, the `Given` step matches this function :

```
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
```

When cucumber run a scenario, it executes the function associated with each step in the given order.

## About the World class

The JavaScript World class is an iolsated environment instantiated at each scenario. It is used to store properties (aka world parameters) and methods so that they can be shared between the steps of a same scenario. Each step can reference the World class as `this` to access them. To create a custom world, we extend the `World` class with our own custom class, `ScenarioWorld` in this case.

```ts
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
```

## Runtime process

When cucumber is executed via CLI command :

1. The reports folder are reset to a default empty state.
2. The `/env/common.env` file is read and the environment variables are set.
3. The `/src` folder and its content written in TypeScript are transpiled to JavaScript into the `/dist` folder.
4. Cucumber run the JavaScript code insde the `/dist` folder.

## Creating a new test suite

### Mapping

Before runnning any tests, the framework we'll need to map some key informations provided by you :

- The tested host
- The tested pages' name and their route
- The tested pages' DOM elements and their locator

_/config/hosts.json_

```json
{
  "selenium": "https://www.selenium.dev"
}
```

_/config/pages.json_

```json
{
  "home": {
    "route": "/",
    "regex": "^/$"
  }
}
```

_/config/mappings/home.json_

```json
{
  "selenium logo": "[id='Layer_1']"
}
```

**IMPORTANT** : When mapping the DOM elements, it is mandatory that the **json file's name matches the page's name**.

Here's a different example :

_/config/pages.json_

```json
{
  "about": {
    "route": "/",
    "regex": "^/$"
  }
}
```

_/config/mappings/about.json_

```json
{
  "selenium logo": "[id='Layer_1']"
}
```

The names of the pages and their DOM elements can now be used as data/arguments in a gherkin scenario.

```gherkin
  Scenario Outline: As a user I expect to be able to see the important stuff
    Given I am on the "home" page
    Then The "selenium logo" should be displayed
```

### Writing a feature file

Firstly, we higly recommend you to install extensions providing full support to `.feature` and `.env` files (autocomplete, syntax highlighting, formatting, etc...). Here are the extensions for VSCode :

- [Cumber (Gherkin) Full Language Support](https://marketplace.visualstudio.com/items?itemName=alexkrechik.cucumberautocomplete)
- [ENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)

To create a new scenario :

1. Create a new `fileName.feature` file in the `/src/features` folder.
2. Inside this file, indicate the name of the tested feature
3. Put the user story as a description of the scenario (only for documentation purpose)
4. Write the name of the scenario
5. Write the steps using the Gherkin keywords. See that they match one of the [steps libraries](#steps-libraries) via RegExp pattern.

For best practices :

- Add comments to your steps
- According to your business logic and your workflow, add tags to your feature and/or scenarios

For example :

![Feature file content](/public/readme/feature-file.png)

Once you've assigned all your custom tags to your features and scenarios, reference them inside the `index.ts` file as followed :

_index.ts_

```ts
const customTag = `${common} --tags '@customTag'`;
```

To be able to run the tests suites with one correponding tag, create this custom script in your `package.json` file :

_package.json_

```json
{
  "scripts": {
    "test:customTag": "./run_tests.sh customTag"
  }
}
```

### Steps libraries

In this framework, **_many steps are already implemented_** as typescript functions. You can find them in the `/src/step-definitions` folder. Thanks to the gherkin extension, they will be highlighted to you for autocompletion as you write your steps inside your `.feature` file.

![Autocompletion](/public/readme/autocompletion.png)

The existing steps are divided into two libraries :

- Actions (`/src/step-definitions`)
- Assertions (`/src/step-definitions/assertions`)

They are also subdived into different kinds of actions and assertions.

- [Actions](#actions)
  - [Alert](#alert)
  - [Check](#check)
  - [Click](#click)
  - [Iframe actions](#iframe-actions)
  - [Navigation](#navigation)
  - [Page](#page)
  - [Scroll](#scroll)
  - [Store](#store)
- [Assertions](#assertions)
  - [Element checked](#element-checked)
  - [Element visibility](#element-visibility)
  - [Iframe assertions](#iframe-assertions)
  - [New page](#new-page)
  - [Stored value](#stored-value)
  - [Table value](#table-value)

#### Actions

##### Alert

- `/^I click (accept)?(dismiss)? on the alert dialog$/`

_See [alert.ts](/src/step-definitions/alert.ts)_

##### Check

- `/^I (check)?(uncheck)? the "([^"]\*)" (?:check box|radio button|switch)$/`

_See [check.ts](/src/step-definitions/check.ts)_

##### Click

- `/^I click the "([^"]\*)" (?:button|link)$`
- `/^I click the ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) "([^"]\*)" (?:button|link)$/`
- `/^I click the element with text "([^"]\*)"$/`

_See [click.ts](/src/step-definitions/click.ts)_

##### Iframe actions

- `/^I fill in the "([^"]\*)" input on the "([^"]\*)" iframe with "([^"]\*)"$/`

_See [iframe.ts](/src/step-definitions/iframe.ts)_

##### Navigation

- `/^I am on the "([^"]\*)" page$/`
- `/^I am directed to the "([^"]\*)" page$/`
- `/^I refresh the "([^"]\*)" page$/`

_See [navigation.ts](/src/step-definitions/navigation.ts)_

##### Page

- `/^I fill in the "([^"]*)" input on the ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) (?:tab|window) with "([^"]*)"$/`
- `/^The "([^"]*)" on the ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) tab should( not)? be displayed$/`
- `/^The "([^"]*)" on the ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) tab should( not)? contain the text "(.*)"$/`
- `/^The "([^"]*)" on the ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) tab should( not)? equal the text "(.*)"$/`

_See [page.ts](/src/step-definitions/page.ts)_

##### Scroll

- `/^I scroll to the "([^"]*)" (?:.*?)$/`
- `/^I scroll to the ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) "([^"]*)" (?:.*?)$/`

_See [scroll.ts](/src/step-definitions/scroll.ts)_

##### Store

- `/^I retrieve the "([^"]*)" text and store it as "([^"]*)" in global variables$/`

_See [stored.ts](/src/step-definitions/stored.ts)_

#### Assertions

##### Element checked

- `/^The "([^"]*)" (?:check box|radio button|switch) should( not)? be checked$/`

_See [verify-element-checked.ts](/src/step-definitions/assertions/verify-element-checked.ts)_

##### Element visibility

- `/^The "([^"]*)" should( not)? be displayed$/`
- `/^The "([^"]*)" should( not)? be enabled$/`
- `/^The ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) "([^"]*)" should( not)? be displayed$/`
- `/^I should( not)? see (\d*) "([^"]*)" displayed$/`

_See [verify-element-visibility.ts](/src/step-definitions/assertions/verify-element-visibility.ts)_

##### Iframe assertions

- `/^The "([^"]*)" on the "([^"]*)" iframe should( not)? be displayed$/`
- `/^The "([^"]*)" on the "([^"]*)" iframe should( not)? contain the text "(.*)"$/`
- `/^The "([^"]*)" on the "([^"]*)" iframe should( not)? equal the text "(.*)"$/`

_See [verify-iframe.ts](/src/step-definitions/assertions/verify-iframe.ts)_

##### New page

- `/^The ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) (?:tab|window) should( not)? contain the title "(.*)"$/`
- `/^The ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) (?:tab|window) should( not)? be displayed$/`
- `/^The ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) (?:tab|window) should( not)? contain the text "(.*)"$/`
- `/^The ([0-9]+th|[0-9]+st|[0-9]+nd|[0-9]+rd) (?:tab|window) should( not)? equal the text "(.*)"$/`

_See [verify-new-page.ts](/src/step-definitions/assertions/verify-new-page.ts)_

##### Stored value

- `/^The "([^"]*)" should( not)? equal the "([^"]*)" stored in global variables$/`
- `/^The "([^"]*)" should( not)? contain the "([^"]*)" stored in global variables$/`

_See [verify-stored-value.ts](/src/step-definitions/assertions/verify-stored-value.ts)_

##### Table value

- `/^The "([^"]*)" table should( not)? equal the following:$/`

_See [verify-table-value.ts](/src/step-definitions/assertions/verify-table-value.ts)_

## What's happening under the hood ?

### The index.ts file

The index.ts file acts as the cucumber.js runtime configuration file.
At each runtime session :

#### Our project-level `/env/common.env` file is assigned to the `COMMON_CONFIG_FILE` environment variable at Node.js-level.

_package.json_

```json
"scripts": {
  "cucumber": "COMMON_CONFIG_FILE=env/common.env",
},
```

Next, we tell dotenv to adopt this `/env/common.env` and its stored variables in its configuration.

_index.ts_

```ts
dotenv.config({ path: env("COMMON_CONFIG_FILE") });
```

#### It parses two JSON files

- The one containing the url of the tested website : `/config/hosts.json`

_hosts.json_

```json
{
  "selenium": "https://www.selenium.dev"
}
```

- The one containing the route of its pages : `/config/pages.json`

_pages.json_

```json
{
  "home": {
    "route": "/",
    "regex": "^/$"
  }
}
```

#### It maps the DOM elements required in each page by their name and their corresponding CSS selector.

_home.json_

```json
{
  "selenium logo": "[id='Layer_1']"
}
```

_index.ts_

```ts
const hostsConfig: HostsConfig = getJsonFromFile(env("HOSTS_URLS_PATH"));
const pagesConfig: PagesConfig = getJsonFromFile(env("PAGES_URLS_PATH"));
const mappingFiles = fs.readdirSync(
  `${process.cwd()}${env("PAGE_ELEMENTS_PATH")}`
);

const pageElementMappings: PageElementMappings = mappingFiles.reduce(
  (pageElementConfigAcc: object, file: string) => {
    const key = file.replace(".json", "");
    const elementMappings = getJsonFromFile(
      `${env("PAGE_ELEMENTS_PATH")}${file}`
    );
    return { ...pageElementConfigAcc, [key]: elementMappings };
  },
  {}
);
```

```js
  { home: { 'selenium logo': "[id='Layer_1']" } }
```

Those three objects, `pageElementMappings`, `pagesConfig` and `hostsConfig` will be passed to the `World` class as world parameters.

_index.ts_

```ts
const worldParameters: GlobalConfig = {
  hostsConfig,
  pagesConfig,
  pageElementMappings,
};
```

_world.ts_

```ts
export class ScenarioWorld extends World {
  constructor(options: IWorldOptions) {
    super(options);

    this.globalConfig = options.parameters as GlobalConfig;

    this.globalVariables = {};
  }

  globalConfig: GlobalConfig;

  globalVariables: GlobalVariables;

  screen!: Screen;
```

#### It configures cucumber's behavior

_index.ts_

```ts
const common = `./src/features/**/*.feature \
  --require-module ts-node/register \
  --require ./src/step-definitions/**/**/*.ts \
  --world-parameters ${JSON.stringify(worldParameters)} \
  --format summary \
  --format html:./reports/report.html \
  --format json:./reports/report.json \
  --format usage-json:./reports/usage.json \
  --parallel ${env("PARALLEL")} \
  --retry ${env("RETRY")}`;
```

- The path of the feature files to be executed.
- The path of the step definitions files to be executed.
- The world parameters to be passed to the step definitions.
- The output format of the reports.
- The number of parallel sessions to be executed (set in the environment variable `PARALLEL`).
- The number of retries to be executed in case of failure (set in the environment variable `RETRY`).

#### It sets the available testing processes

_index.ts_

```ts
// Available testing processes
const dev = `${common} --tags '@dev'`;
const smoke = `${common} --tags '@smoke'`;
const regression = `${common} --tags '@regression'`;

export { dev, regression, smoke };
```

The tags `@dev`, `@smoke` and `@regression` are used to filter the scenarios to be executed. Their name is arbitrary and can be changed.
If the `@dev` tag is used, only the scenarios tagged with `@dev` will be executed.

```gherkin
Feature: As a user I expect to be able to navigate the homepage

  @dev
  @smoke
  @regression
  Scenario Outline: As a user I expect to be able to see the important stuff
    Given I am on the "home" page
    Then The <item> should be displayed

    Examples:
      | item                |
      | "selenium logo"     |
      | "copyright section" |
```

The `index.ts` is dynamic and will be updated according to the environment variables, its content will be transpiled to JavaScript into the `/dist` folder.

#### Transpiling and execution

We use **Babel** to transpile the TypeScript from the `/src` code to JavaScript into the `/dist` folder.

_.babelrc_

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-typescript"]
}
```

_package.json_

```json
  "scripts": {
    "transpile": "rimraf dist && babel --extensions .ts --out-dir dist src"
  }
```

The `cumcumber.js` file will tell cucumber-js to look into the JavaScript code inside the `/dist` folder.

_cucumber.js_

```js
module.exports = require("./dist");
```

### The .feature file

Once the runtime environment is set up, the transpiling is done and cucumber-js is running, the `.feature` files are parsed and the scenarios are executed.

_home-page.feature_

```gherkin
  Feature: As a user I expect to be able to navigate the homepage

  @dev
  @smoke
  @regression
  Scenario Outline: As a user I expect to be able to see the important stuff
    Given I am on the "home" page
    Then The <item> should be displayed

    Examples:
      | item                |
      | "selenium logo"     |
      | "copyright section" |
```

_There is more to read about the Gherkin syntax [here](https://cucumber.io/docs/gherkin/reference/). More practical examples can be found [here](https://automationpanda.com/2017/01/27/bdd-101-gherkin-by-example/)._

At runtime, cucumber-js will go through the .feature file :

1. Read the feature's name
2. Check if the scenario's tags matches one of the available testing processes
3. Read the scenario's name
4. Run the steps and their associated functions
5. Loop through the scenario's steps while applying different variables at `<item>` according to those specified in the `Examples` table.

**Each step is linked to a function via a regular expression pattern.**

_home-page.feature_

```gherkin
Given I am on the "home" page
```

_navigation.ts_

```ts
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
```

### The hooks

#### Before

Before each scenario, a `Before` hook will be executed.

_hooks.ts_

```ts
Before(async function (scenario) {
  const ready: string = await this.init();

  console.log(
    "- Running scenario " + customChalk.yellow(scenario.pickle.name) + "\n"
  );

  return ready;
});
```

- It calls the `init` function from the `World` class to initialize the browser.
- Indicates the name of the scenario being executed in the console.

#### After

After each scenario, an `After` hook will be executed.

_hooks.ts_

```ts
After(async function (this: ScenarioWorld, scenario) {
  const {
    screen: { driver },
  } = this;

  const scenarioStatus = scenario.result?.status;

  // Take a screenshot after each fail
  if (scenarioStatus === "FAILED") {
    driver.takeScreenshot().then((screenshot) => {
      const buffer = Buffer.from(screenshot, "base64");
      this.attach(buffer, "image/png");

      if (!fs.existsSync(env("SCREENSHOT_PATH"))) {
        fs.mkdirSync(env("SCREENSHOT_PATH"));
      }

      fs.writeFileSync(
        `${env("SCREENSHOT_PATH")}${scenario.pickle.name.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}.png`,
        buffer
      );
    });
  }

  await driver.quit(); // Quit the driver
});
```

- If the scenario fails, a screenshot will be taken and attached to the report.
- The browser session will be closed.

## Implementing your own step

The currently implemented steps may not cover some of your test cases. If so, you'll have to implement your own steps into one of the libraries :

- Actions (`/src/step-definitions`)
- Assertions (`/src/step-definitions/assertions`)

**Reminder** : These libraries are divided into different kinds of actions and assertions materialized by a .ts file (e.g. `alert.ts`, `verify-element-visibility.ts`, etc...).

If the step needed doesn't fit in one of these kinds, feel free to create a new .ts file in the corresponding librarie (e.g. `/src/step-definitions/assertions/verify-session-state.ts`). and to implement your step inside it as a typescript function.

Let's implement these two steps :

_home-page.feature_

```gherkin
  Scenario Outline: As a user I expect to be able to see the important stuff
    Given I am on the "home" page
    Then The <item> should be displayed

    Examples:
      | item                |
      | "selenium logo"     |
      | "copyright section" |
```

This is a `scenario outline` (or `scenario template`), meaning that multiple arguments are passed to its steps.

1. The `Given` has one string argument with a default value of `"home"`
2. The `Then` has argument that will receive the values of the `item` column in the "examples" table.

### The step functions

The three main gherkin keyword have a corresponding **step function** :

- `Given -> Given()`
- `When -> When()`
- `Then -> Then()`

These three step functions must contain two arguments :

1. The first parameter must be a RegExp pattern matching the step's name.
2. The second one must be an asynchronous function containing the test logic. We'll call it the **test function** from now on.

_navigation.ts_

```ts
Given(/^I am on the "([^"]*)" page$/, async function () {});
```

The step function `Given()` has the step name `I am on the "([^"]*)" page` and the test function `async function () {}` as its parameters.

### The test functions

The test function **must** have at least one parameter, the one referencing the `ScenarioWorld` class as `this`. Its other parameters must be the arguments passed to the steps in the `.feature` file,in this case, the page's name.

_navigation.ts_

```ts
Given(
  /^I am on the "([^"]*)" page$/,
  async function (this: ScenarioWorld, pageId: PageId) {}
);
```

_NB: The `PageId` type is declared as a string in our type declaration file (`/src/env/global.ts`)._

#### Using the world properties

Now we can use the `ScenarioWorld` class to retrieve the world properties.

_navigation.ts_

```ts
Given(
  /^I am on the "([^"]*)" page$/,
  async function (this: ScenarioWorld, pageId: PageId) {
    const {
      screen: { driver },
      globalConfig,
    } = this;
  }
);
```

#### Using the helper functions

In order to keep our concerns separated, we moblize the Selenium WebDriver API through custom **helper functions** defined in the `/src/support` folder.

_navigation.ts_

```ts
Given(
  /^I am on the "([^"]*)" page$/,
  async function (this: ScenarioWorld, pageId: PageId) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    await navigateToPage(driver, pageId, globalConfig);
  }
);
```

_navigation-behavior.ts_

```ts
export const navigateToPage = async (
  driver: WebDriver,
  pageId: PageId,
  { pagesConfig, hostsConfig }: GlobalConfig
): Promise<void> => {
  const { UI_AUTOMATION_HOST: hostName = "local" } = process.env;

  const hostPath = hostsConfig[`${hostName}`];

  const url = new URL(hostPath);

  const pageConfigItem = pagesConfig[pageId];

  url.pathname = pageConfigItem.route;

  await driver.get(url.href);
};
```

#### Waiting strategy

We set a waiting strategy to make sure that the page and its content have enough time to load before being tested. The strategy is to set a global timeout of 15 seconds and a waiting time of 2 seconds between each test.

_navigation.ts_

```ts
Given(
  /^I am on the "([^"]*)" page$/,
  async function (this: ScenarioWorld, pageId: PageId) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    await navigateToPage(driver, pageId, globalConfig);

    await waitFor();
  }
);
```

_wait-for-behavior.ts_

```ts
export const waitFor = async <T>(
  predicate: () => T | Promise<T>,
  options?: { timeout?: number; wait?: number }
): Promise<T> => {
  const { timeout = 15000, wait = 2000 } = options || {};

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const startDate = new Date();

  while (new Date().getTime() - startDate.getTime() < timeout) {
    const result = await predicate();
    if (result) return result;

    await sleep(wait);
    console.log(`Waiting ${wait}ms`);
  }
  throw new Error(`Wait time of ${timeout}ms exceeded`);
};
```

Of course, this strategy can be adapted to your needs.

Then, inside this waiting strategy, we proceed to the test.

_navigation.ts_

```ts
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
```

#### Using the page element mappings

Let's implement the second step to provide a different example.

_home-page.feature_

```gherkin
  Scenario Outline: As a user I expect to be able to see the important stuff
    Given I am on the "home" page
    Then The <item> should be displayed

    Examples:
      | item                |
      | "selenium logo"     |
      | "copyright section" |
```

In this test function function we also retrieve the DOM element's locator using a custom helper function.

_veridfy-element-visibility.ts_

```ts
Then(
  /^The "([^"]*)" should( not)? be displayed$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, negate: Negate) {
    const {
      screen: { driver },
      globalConfig,
    } = this;

    const elementIdentifier = await getElementLocator(
      driver,
      elementKey,
      globalConfig
    );
  }
);
```

**REMINDER** : The world's `globalConfig` property contains :

- The `hostsConfig` object (name and url of the tested website)

```json
{
  "selenium": "https://www.selenium.dev"
}
```

- The `pagesConfig` object (name and route of the tested pages)

```json
{
  "home": {
    "route": "/",
    "regex": "^/$"
  }
}
```

- The `pageElementMappings` object (name and locator of the tested DOM elements wrapped in a their page's name object)

```json
{
  "home": {
    "selenium logo": "[id='Layer_1']"
  }
}
```

_web-element-helper.ts_

```ts
export const getElementLocator = async (
  driver: WebDriver,
  elementKey: ElementKey,
  globalConfig: GlobalConfig
): Promise<ElementLocator> => {
  const { pageElementMappings } = globalConfig;

  const currentPage = await getCurrentPageId(driver, globalConfig);

  const elementIdentifier =
    pageElementMappings[currentPage]?.[elementKey] ||
    pageElementMappings.common?.[elementKey];

  if (!elementIdentifier) {
    throw new Error(`Unable to find the ${elementKey} mapping`);
  }

  return elementIdentifier;
};
```

Next, we mobilize the selenium API to verify the visibility of the tested DOM element inside our waiting strategy.

_verify-element-visibility.ts_

```ts
Then(
  /^The "([^"]*)" should( not)? be displayed$/,
  async function (this: ScenarioWorld, elementKey: ElementKey, negate: Negate) {
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
      const isElementVisible = await elementDisplayed(
        driver,
        elementIdentifier
      );
      return isElementVisible === !negate;
    });
  }
);
```

_html-behavior.ts_

```ts
export const elementDisplayed = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<boolean | null> => {
  try {
    await driver.findElement(By.css(elementIdentifier));
    return true;
  } catch {
    return false;
  }
};
```

To resume this whole general process :

1. Pass the scenario's arguments as parameters to the test function
2. Retrieve the necessary world properties
3. Get the DOM element's locator
4. Test the DOM element inside a waiting strategy

_NB : In some use cases, you may not need to retrieve the DOM element's locator._

### Implementing new helper functions

Though we leverage the Selenium Webdriver API with helper functions, Selenium Webdriver has a lot of useful features that are not covered by our helper functions yet.
We encourage you to look through the [Selenium Webdriver documentation](https://www.selenium.dev/documentation/webdriver/) to find the fittest browser interaction to implement in your own custom helper function.
Feel free to look through the [existing helper functions](/src/support/html-behavior.ts) to get inspired.

## Capitalizing the knowledge

As you can see, this test framework is at its first glance. The main goal we'll always be to provide a working environment to end-to-end tests by simply :

- Indicating a website, its pages, their route and DOM elements
- Writing a scenario (`.feature` file) while leveraging the existing libraries

Those libraries cover general and simple use cases. They still have to be extended to cover more complex ones. As you through your own implementations, we encourage you to submit your findings : actions, assertions, helper functions, etc...

Our next step we'll be to provide a better structure for knwoledge sharing.

If you have any questions, feel free to open an issue on the [GitHub repository](https://github.com/odinasgard/selenium-cucumber-js).
