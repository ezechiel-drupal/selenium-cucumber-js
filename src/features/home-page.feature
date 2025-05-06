Feature: Homepage
  As a user
  I expect to be able to see the webdriver logo
  So that I'm sure that I'm on the home page

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
