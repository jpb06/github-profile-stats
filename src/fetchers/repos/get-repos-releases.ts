import { Console, Effect, pipe } from 'effect';
import {
  type EffectResultSuccess,
  OctokitLayer,
  type UserRepositoriesResult,
} from 'effect-octokit-layer';
import colors from 'picocolors';

import { octokitUserRepoToLayerRepoArgs } from './octokit-user-repo-to-repo-args.js';

export type GetReposReleasesResult = EffectResultSuccess<
  typeof getReposReleases
>;

export const getReposReleases = (
  repos: UserRepositoriesResult,
  verbose: boolean,
) =>
  pipe(
    Effect.forEach(repos, (octokitRepo) =>
      Effect.gen(function* () {
        const repo = octokitUserRepoToLayerRepoArgs(octokitRepo);

        if (verbose) {
          yield* Console.info(
            `- ℹ️  Getting releases for ${colors.greenBright(`${repo.owner}/${repo.repo}`)}.`,
          );
        }

        const releases = yield* OctokitLayer.repo(repo).releases();

        return { repo, releases };
      }),
    ),
    Console.withTime('☑️  Fetched user repositories releases'),
    Effect.withSpan('get-repos-releases'),
  );
