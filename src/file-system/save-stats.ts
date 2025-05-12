import { FileSystem } from '@effect/platform';
import { compareDesc, format, parse } from 'date-fns';
import { Console, Effect, pipe } from 'effect';
import colors from 'picocolors';

import type { GithubUserStats } from '../types/user-stats.type.js';
import { printDiff } from './print-diff.js';

const extractDateFromFilename = (file: string) =>
  parse(file.split('.')[0].split('_')[1], 'dd-MM-yy', new Date());

const getNewestFile = (files: string[]) =>
  files.sort((a, b) => {
    const dateA = extractDateFromFilename(a);
    const dateB = extractDateFromFilename(b);

    return compareDesc(dateA, dateB);
  })[0];

export const saveStats = (username: string, stats: GithubUserStats) =>
  pipe(
    Effect.gen(function* () {
      const { writeFileString, readDirectory } = yield* FileSystem.FileSystem;

      const filePath = `./data/${username}-stats_${format(new Date(), 'dd-MM-yy')}.json`;
      yield* Console.info(
        `✅ ${colors.greenBright(username)} stats retrieved - saving to '${colors.greenBright(filePath)}'`,
      );

      const files = yield* readDirectory('./data');
      yield* writeFileString(filePath, JSON.stringify(stats, null, 2));

      if (files.length > 0) {
        const newestFile = getNewestFile(files);
        const previousFilePath = `./data/${newestFile}`;

        yield* printDiff(previousFilePath, filePath);
      }
    }),
    Effect.withSpan('save-stats', { attributes: { username } }),
  );
