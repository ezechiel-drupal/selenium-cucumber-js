Feature: As a user I expect to be able to navigate the homepage

  @dev
  @smoke
  @regression
  Scenario: As a user I expect to be able to see the context header
    Given I am on the "home" page
    Then The "partners header" should contain the text "Development Partners"
    Then The "webdriver logo" should be displayed

