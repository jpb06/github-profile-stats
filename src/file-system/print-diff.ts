import { Command } from '@effect/platform';
import { Console, Effect, pipe } from 'effect';
import { bgGreenBright } from 'picocolors';

export const printDiff = (oldFilePath: string, newFilePath: string) =>
  pipe(
    Effect.gen(function* () {
      yield* Console.info('');
      yield* Console.info(bgGreenBright(' Diff '));

      const cmd = Command.make('jsondiffpatch', oldFilePath, newFilePath);
      const output = yield* Command.string(cmd);

      yield* Console.info(
        output.length > 0 ? output : 'No changes since last fetch',
      );
    }),
    Effect.withSpan('print-diff'),
  );
