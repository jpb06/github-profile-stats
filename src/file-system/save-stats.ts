import { FileSystem } from '@effect/platform';
import { compareDesc, format, parse } from 'date-fns';
import { Console, Effect, pipe } from 'effect';
import { greenBright } from 'picocolors';

import type { GithubUserStats } from './../workflow/user-stats.type.js';
import { printDiff } from './print-diff.js';

const getDate = (file: string) => file.split('.')[0].split('_')[1];

const sortFiles = (files: string[]) =>
  files.sort((a, b) => {
    const dateA = parse(getDate(a), 'dd-MM-yy', new Date());
    const dateB = parse(getDate(b), 'dd-MM-yy', new Date());

    return compareDesc(dateA, dateB);
  });

export const saveStats = (username: string, stats: GithubUserStats) =>
  pipe(
    Effect.gen(function* () {
      const { writeFileString, readDirectory } = yield* FileSystem.FileSystem;

      const filePath = `./data/${username}-stats_${format(new Date(), 'dd-MM-yy')}.json`;
      yield* Console.info(
        `✅ ${greenBright(username)} stats retrieved - saving to '${greenBright(filePath)}'`,
      );

      const files = yield* readDirectory('./data');
      yield* writeFileString(filePath, JSON.stringify(stats, null, 2));

      if (files.length > 0) {
        const sortedFilesByDateDesc = sortFiles(files);
        const previousFilePath = `./data/${sortedFilesByDateDesc[0]}`;

        yield* printDiff(previousFilePath, filePath);
      }
    }),
    Effect.withSpan('save-stats', { attributes: { username } }),
  );
