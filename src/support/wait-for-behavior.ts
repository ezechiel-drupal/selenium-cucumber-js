import { By, WebDriver } from "selenium-webdriver";
import { ElementLocator } from "../env/global";
import { switchIframe, switchWindow } from "./html-behavior";

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

export const waitForSelector = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<boolean> => {
  try {
    await driver.switchTo().defaultContent();
    await driver.findElement(By.css(elementIdentifier));
    return true;
  } catch {
    return false;
  }
};

export const waitForSelectors = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<boolean> => {
  try {
    await driver.switchTo().defaultContent();
    await driver.findElements(By.css(elementIdentifier));
    return true;
  } catch {
    return false;
  }
};

export const waitForSelectorAtIndex = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<boolean> => {
  try {
    await driver.switchTo().defaultContent();
    await driver
      .findElement(By.className(elementIdentifier))
      .then(async (element) => {
        await element.getAttribute("class");
      });
    return true;
  } catch {
    return false;
  }
};

export const waitForSelectorWithText = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator
): Promise<boolean> => {
  try {
    await driver.switchTo().defaultContent();
    await driver.findElement(By.xpath(elementIdentifier));
    return true;
  } catch {
    return false;
  }
};

export const waitForSelectorInIframe = async (
  driver: WebDriver,
  elementIframe: ElementLocator,
  elementIdentifier: ElementLocator
): Promise<boolean> => {
  try {
    await switchIframe(driver, elementIframe);
    await driver.findElement(By.css(elementIdentifier));
    return true;
  } catch {
    return false;
  }
};

export const waitForSelectorOnPage = async (
  driver: WebDriver,
  elementIdentifier: ElementLocator,
  pageIndex: number
): Promise<boolean> => {
  try {
    await switchWindow(driver, pageIndex);
    await driver.findElement(By.css(elementIdentifier));
    return true;
  } catch {
    return false;
  }
};
