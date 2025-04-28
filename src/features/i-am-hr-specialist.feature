Feature: As a user I expect to be able to navigate through the content

  @dev
  @smoke
  @regression
  Scenario Outline: As a user I am navigating through each sub tab
    Given I am on the "rh-specialist" page
    When I click the <button> button
    Then The <profile accroche> should be displayed

    Examples:
      | button                                            | profile accroche      |
      | "Tous profils"                                    | "all profiles"        |
      | "Responsable RH"                                  | "hr manager"          |
      | "Recruteur en recherche de candidats"             | "candidate recruiter" |
      | "Recruteur en recherche d'alternant ou stagiaire" | "intern recruiter"    |
