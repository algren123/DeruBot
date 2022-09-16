import puppeteer from 'puppeteer';

export type ValorantPost = {
  postTitle?: string | null;
  postLink?: string | null | undefined;
  patchImage?: string | null;
};

type Patch = {
  patchTitle: string;
  patchLink: string;
  patchDescription: string;
  patchImage?: string;
};

export const getLatestValorantPost = async (): Promise<ValorantPost> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Getting Valorant patch post text...');
  await page.goto('https://playvalorant.com/en-us/news/game-updates/', {
    waitUntil: 'networkidle0',
  });

  const result = await page.evaluate(() => {
    let latestPost: ValorantPost = {};
    const post = [...document.querySelectorAll("[data-testid^='card']")].find(
      (el) => el.innerHTML.includes('Patch Notes')
    );

    latestPost.postTitle = post?.querySelector('.heading-05')?.innerHTML;
    latestPost.postLink = post?.getAttribute('href');
    latestPost.patchImage = post?.querySelector('img')?.getAttribute('src');

    return latestPost;
  });

  browser.close();
  return result;
};

export const getValorantPatchDetails = async (
  url: string,
  imgSrc?: string
): Promise<Patch> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Getting Valorant Patch Details...');
  await page.goto('https://playvalorant.com' + url);

  const result = await page.evaluate(() => {
    let patch: Patch = {
      patchTitle: '',
      patchLink: '',
      patchDescription: '',
    };

    patch.patchTitle = document.querySelector('h2')?.innerText as string;
    patch.patchDescription = document.querySelector('.copy-02 > p')
      ?.textContent as string;
    patch.patchLink = document.location.href;

    return patch;
  });

  if (imgSrc) {
    result.patchImage = imgSrc;
  }

  browser.close();
  return result;
};
