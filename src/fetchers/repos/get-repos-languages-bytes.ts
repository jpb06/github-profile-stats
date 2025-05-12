import { Console, Effect, pipe } from 'effect';
import {
  type EffectResultSuccess,
  OctokitLayer,
  type UserRepositoriesResult,
} from 'effect-octokit-layer';
import colors from 'picocolors';

import { octokitUserRepoToLayerRepoArgs } from './octokit-user-repo-to-repo-args.js';

export type GetReposLanguagesBytesResult = EffectResultSuccess<
  typeof getReposLanguagesBytes
>;

export const getReposLanguagesBytes = (
  repos: UserRepositoriesResult,
  verbose: boolean,
) =>
  pipe(
    Effect.forEach(repos, (octokitRepo) =>
      Effect.gen(function* () {
        const repo = octokitUserRepoToLayerRepoArgs(octokitRepo);

        if (verbose) {
          yield* Console.info(
            `- ℹ️  Getting languages bytes for ${colors.greenBright(`${repo.owner}/${repo.repo}`)}.`,
          );
        }

        return yield* OctokitLayer.repo(repo).languages();
      }),
    ),
    Effect.map((data) => {
      const languagesBytesMap = new Map<string, number>();

      for (const record of data.map((languagesBytes) => languagesBytes)) {
        for (const [key, value] of Object.entries(record)) {
          if (languagesBytesMap.has(key)) {
            languagesBytesMap.set(key, languagesBytesMap.get(key)! + value);
          } else {
            languagesBytesMap.set(key, value);
          }
        }
      }

      return Object.fromEntries(languagesBytesMap);
    }),
    Console.withTime('☑️  Fetched user repositories languages bytes'),
    Effect.withSpan('get-repos-languages-bytes'),
  );
