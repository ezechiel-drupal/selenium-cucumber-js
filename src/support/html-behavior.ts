import { By, WebDriver, WebElement } from "selenium-webdriver";
import { ElementLocator, InputValue } from "../env/global";

export const getElementByCssSelector = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<WebElement> => {
  const element = await driver.findElement(By.css(elementIdentifier));
  return element;
};

export const getElementsByCssSelector = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<WebElement[]> => {
  const elements = await driver.findElements(By.css(elementIdentifier));
  return elements;
};

export const elementDisplayed = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<boolean | null> => {
  try {
    await driver.findElement(By.id(elementIdentifier));
    return true;
  } catch {
    return false;
  }
};

export const getElementText = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<string | null> => {
  const element = await getElementByCssSelector(driver, elementIdentifier);
  const elementText = await element.getAttribute("innerText");
  return elementText;
};

export const getElementTextAtIndex = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator,
  index: number
): Promise<string | null> => {
  const elements = await getElementsByCssSelector(driver, elementIdentifier);
  const textAtIndex = await elements[index].getText();
  return textAtIndex;
};

export const clickElement = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<void> => {
  const element = await getElementByCssSelector(driver, elementIdentifier);
  await element.click();
};

export const clickElementAtIndex = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator,
  index: number
): Promise<void> => {
  const elements = await getElementsByCssSelector(driver, elementIdentifier);
  await elements[index].click();
};

export const clickElementWithText = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<void> => {
  const element = await driver.findElement(By.xpath(elementIdentifier));
  await element.click();
};

export const elementChecked = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<boolean | null> => {
  const element = await getElementByCssSelector(driver, elementIdentifier);
  if (!(await element.isSelected())) {
    return false;
  }
  return true;
};

export const getElementValue = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<string | null> => {
  const element = await getElementByCssSelector(driver, elementIdentifier);
  const elementValue = await element.getAttribute("value");
  return elementValue;
};

export const scrollElementIntoView = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<void> => {
  const element = await getElementByCssSelector(driver, elementIdentifier);
  await driver.executeScript("arguments[0].scrollIntoView(false);", element);
  await driver.sleep(1500);
};

export const scrollElementIntoViewAtIndex = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator,
  index: number
): Promise<void> => {
  const element = await getElementsByCssSelector(driver, elementIdentifier);
  await driver.executeScript(
    "arguments[0].scrollIntoView(false);",
    element[index]
  );
  await driver.sleep(1500);
};

export const elementEnabled = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<boolean | null> => {
  const element = await getElementByCssSelector(driver, elementIdentifier);
  if (!(await element.isEnabled())) {
    return false;
  } else {
    return true;
  }
};

export const switchIframe = async (
  driver: WebDriver,
  elementIframe: ElementLocator
): Promise<void> => {
  await driver.switchTo().frame(driver.findElement(By.css(elementIframe)));
};

export const switchWindow = async (
  driver: WebDriver,
  pageIndex: number
): Promise<void> => {
  const winHandles = await driver.getAllWindowHandles();
  const currentWindow = winHandles[pageIndex];
  await driver.switchTo().window(currentWindow);
};

export const inputElementValue = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator,
  inputValue: InputValue
): Promise<void> => {
  const element = await getElementByCssSelector(driver, elementIdentifier);
  await element.clear();
  await element.sendKeys(inputValue);
};

export const getTitleWithinPage = async (
  driver: WebDriver,
  pageIndex: number
): Promise<string | null> => {
  await switchWindow(driver, pageIndex);

  return driver.getTitle();
};
