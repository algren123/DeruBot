import { shuffle } from '../helpers/shuffle';

export const makeTeams = (users: string[]): Map<any, any> => {
  const players = shuffle(users);
  const teams = new Map();

  for (let i = 0; i < players?.length; i++) {
    if ((i + 2) % 2 === 0) {
      teams.set('a', players?.[i]);
    } else {
      teams.set('b', players?.[i]);
    }
  }

  return teams;
};

export const shuffleTeams = (map: Map<any, any>): Map<any, any> => {
  const playersArray = Array.from(map, ([team, members]) => members);
  return makeTeams(playersArray);
};
