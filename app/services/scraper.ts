import { Patch } from 'app/consts/types';
import { getLeaguePatch, getLatestLeaguePost, LeaguePost } from './league';
import {
  getLatestValorantPost,
  getValorantPatchDetails,
  ValorantPost,
} from './valorant';

export const retrieveUpdates = async () => {
  console.log(`Update check started at ${new Date().toTimeString()}...`);
  let newPatches: Patch[] = [];
  const latestLeaguePost = await getLatestLeaguePost();
  const latestValorantPost = await getLatestValorantPost();

  if (currentLeaguePost !== latestLeaguePost?.postTitle) {
    console.log('League Update found. Retrieving...');
    currentLeaguePost = latestLeaguePost?.postTitle;

    const newLeaguePatch = await getLeaguePatch(
      latestLeaguePost?.postLink as string
    );

    newPatches.push(newLeaguePatch);
  }

  if (currentValorantPost !== latestValorantPost.postTitle) {
    console.log('Valorant Update found. Retrieving...');
    currentValorantPost = latestValorantPost?.postTitle;

    const newValorantPatch = await getValorantPatchDetails(
      latestValorantPost?.postLink as string,
      latestValorantPost?.patchImage as string
    );

    newPatches.push(newValorantPatch);
  }

  return newPatches;
};

let currentLeaguePost: string | undefined | null = '';
let currentValorantPost: string | undefined | null = '';
