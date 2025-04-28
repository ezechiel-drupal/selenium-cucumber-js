Feature: As a user I expect to be able to navigate the homepage

  @dev
  @smoke
  @regression
  Scenario: As a user I expect to be able to see the context header
    Given I am on the "home" page
    Then The "copyright section" should be displayed
