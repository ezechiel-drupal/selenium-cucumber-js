import { WebDriver } from "selenium-webdriver";
import { ElementKey, ElementLocator, GlobalConfig } from "../env/global";
import { getCurrentPageId } from "./navigation-behavior";

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
