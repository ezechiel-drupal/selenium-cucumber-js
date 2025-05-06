import { WebDriver } from "selenium-webdriver";
import { GlobalConfig, PageId } from "../env/global";

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

export const currentPathMatchesPageId = async (
  driver: WebDriver,
  pageId: PageId,
  globalConfig: GlobalConfig
): Promise<boolean> => {
  const currentURL: string = await driver.getCurrentUrl();
  const { pathname: currentPath } = new URL(currentURL);

  // Debugging help: console.log("currentPath", currentPath);

  return pathMatchesPageId(currentPath, pageId, globalConfig);
};

const pathMatchesPageId = (
  path: string,
  pageId: PageId,
  { pagesConfig }: GlobalConfig
): boolean => {
  const pageRegexString = pagesConfig[pageId].regex;
  const pageRegex = new RegExp(pageRegexString);
  return pageRegex.test(path);
};

export const getCurrentPageId = async (
  driver: WebDriver,
  globalConfig: GlobalConfig
): Promise<PageId> => {
  const { pagesConfig } = globalConfig;

  const currentURL: string = await driver.getCurrentUrl();

  const pageConfigPagesIds = Object.keys(pagesConfig);

  const { pathname: currentPath } = new URL(currentURL);

  const currentPageId = pageConfigPagesIds.find((pageId) =>
    pathMatchesPageId(currentPath, pageId, globalConfig)
  );

  if (!currentPageId) {
    throw new Error(`Failed to get page name from current route ${currentPath}, \
      possible pages: ${JSON.stringify(pagesConfig)}`);
  }

  return currentPageId;
};

export const reloadPage = async (driver: WebDriver): Promise<void> => {
  await driver.navigate().refresh();
};
