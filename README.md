# Actency test framework

This test framework is based on the [Cucumber-JS](https://github.com/cucumber/cucumber-js) framework and its [Gherkin](https://cucumber.io/docs/gherkin/reference/) language. It uses the [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/) API to automate browser interactions following scripts written in [TypeScript](https://www.typescriptlang.org/).

## Getting Started

### Prerequisites

- Node.js
- pnpm
- Git

### Installation

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
> selenium-cucumber-js@latest test:dev /Path/to/test-framework
> ./run_tests.sh dev


> selenium-cucumber-js@latest precucumber /Path/to/test-framework
> rimraf reports && mkdir reports


> selenium-cucumber-js@latest cucumber /Path/to/test-framework
> COMMON_CONFIG_FILE=env/common.env pnpm cucumber-compile "--profile" "dev"


> selenium-cucumber-js@latest cucumber-compile /Path/to/test-framework
> pnpm transpile && cucumber-js "--profile" "dev"


> selenium-cucumber-js@latest transpile /Path/to/test-framework
> rimraf dist && babel --extensions .ts --out-dir dist src

Successfully compiled 14 files with Babel (1097ms).

Requesting cucumber...

- Running scenario As a user I expect to be able to create a new contact

- Running scenario As a user I expect to be able to see the context header

2 scenarios (2 passed)
6 steps (6 passed)
0m05.534s (executing steps: 0m05.505s)
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
