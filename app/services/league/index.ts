import puppeteer from 'puppeteer';
import { Patch } from 'app/consts/types';

export type LeaguePost = {
  postTitle?: string;
  postLink?: string | null;
};

export const getLatestLeaguePost = async (): Promise<LeaguePost> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Getting League patch post text...');
  await page.goto(
    'https://www.leagueoflegends.com/en-us/news/tags/patch-notes/'
  );

  const result = await page.evaluate(() => {
    let latestPost: LeaguePost = {};
    latestPost.postTitle = document.querySelector(
      '[data-testid="articlelist:article-0:title"]'
    )?.innerHTML;
    latestPost.postLink = document
      .querySelector('[href^="/en-us/"]')
      ?.getAttribute('href');

    return latestPost;
  });

  browser.close();
  return result;
};

export const getLeaguePatch = async (url: string): Promise<Patch> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Getting League Patch Details...');
  await page.goto('https://www.leagueoflegends.com' + url);

  const result = await page.evaluate(() => {
    let patch: Patch = {
      patchTitle: '',
      patchImage: '',
      patchLink: '',
      patchDescription: '',
    };

    patch.patchTitle = `LEAGUE OF LEGENDS ${
      document.querySelector('h1')?.innerText
    }`;
    patch.patchDescription = document.querySelector('.blockquote')
      ?.textContent as string;
    patch.patchImage = document
      .querySelector('.skins > img')
      ?.getAttribute('src') as string;
    patch.patchLink = document.location.href;

    return patch;
  });

  browser.close();
  return result;
};
