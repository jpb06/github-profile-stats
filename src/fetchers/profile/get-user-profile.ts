import { Console, Effect, pipe } from 'effect';
import { type EffectResultSuccess, OctokitLayer } from 'effect-octokit-layer';
import colors from 'picocolors';

export type GetUserProfileResult = EffectResultSuccess<typeof getUserProfile>;

export const getUserProfile = (username: string) =>
  pipe(
    OctokitLayer.user(username).profile(),
    Console.withTime(`☑️  Fetched ${colors.greenBright(username)} profile`),
    Effect.withSpan('get-user-profile', { attributes: { username } }),
  );
