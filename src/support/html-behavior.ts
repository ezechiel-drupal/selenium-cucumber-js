import { By, WebDriver, WebElement } from "selenium-webdriver";
import { ElementLocator } from "../env/global";

export const getElement = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<WebElement> => {
  const element = await driver.findElement(By.css(elementIdentifier));
  return element;
};

export const elementDisplayed = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<boolean | null> => {
  try {
    await driver.findElement(By.id(elementIdentifier));
    return true;
  } catch (error) {
    return false;
  }
};

export const getElementText = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<string | null> => {
  const element = await getElement(driver, elementIdentifier);
  const elementText = await element.getAttribute("innerText");
  return elementText;
};
