import { Console, Effect, pipe } from 'effect';
import {
  type EffectResultSuccess,
  OctokitLayer,
  type UserRepositoriesResult,
} from 'effect-octokit-layer';
import colors from 'picocolors';

import { octokitUserRepoToLayerRepoArgs } from './octokit-user-repo-to-repo-args.js';

export type GetReposTagsResult = EffectResultSuccess<typeof getReposTags>;

export const getReposTags = (repos: UserRepositoriesResult, verbose: boolean) =>
  pipe(
    Effect.forEach(repos, (octokitRepo) =>
      Effect.gen(function* () {
        const repo = octokitUserRepoToLayerRepoArgs(octokitRepo);

        if (verbose) {
          yield* Console.info(
            `- ℹ️  Getting tags for ${colors.greenBright(`${repo.owner}/${repo.repo}`)}.`,
          );
        }

        const tags = yield* OctokitLayer.repo(repo).tags();

        return { repo, tags };
      }),
    ),
    Console.withTime('☑️  Fetched user repositories tags'),
    Effect.withSpan('get-repos-tags'),
  );
