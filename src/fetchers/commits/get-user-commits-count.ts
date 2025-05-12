import { Console, Effect, pipe } from 'effect';
import { OctokitLayer } from 'effect-octokit-layer';
import colors from 'picocolors';

export const getUserCommitsCount = (username: string) =>
  pipe(
    OctokitLayer.user(username).getCommitsCount(),
    Console.withTime(`☑️  Fetched ${colors.greenBright(username)} commits count`),
    Effect.withSpan('get-user-commits-count', {
      attributes: { username },
    }),
  );
