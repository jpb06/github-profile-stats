import { Console, Effect, pipe } from 'effect';
import { type EffectResultSuccess, OctokitLayer } from 'effect-octokit-layer';
import colors from 'picocolors';

import { mapUserReposResult } from './map-user-repos-result.js';

export type GetUserReposResult = EffectResultSuccess<typeof getUserRepos>;

export const getUserRepos = (username: string) =>
  pipe(
    Effect.gen(function* () {
      const user = OctokitLayer.user('jpb06');
      const allRepos = yield* user.repos('all');

      const userRepos = allRepos.filter(
        (repo) => repo.owner.login === username && repo.fork === false,
      );
      const userReposStats = mapUserReposResult(userRepos);

      return {
        userReposStats,
        allRepos,
        userRepos,
      };
    }),
    Console.withTime(`☑️  Fetched ${colors.greenBright(username)} repositories`),
    Effect.withSpan('get-user-repos', { attributes: { username } }),
  );
