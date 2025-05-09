import { Console, Effect, pipe } from 'effect';
import { type EffectResultSuccess, OctokitLayer } from 'effect-octokit-layer';
import { greenBright } from 'picocolors';

export type GetPullRequestsCountResult = EffectResultSuccess<
  typeof getUserPullRequestsCount
>;

export const getUserPullRequestsCount = (username: string) =>
  pipe(
    Effect.all([
      OctokitLayer.user(username).getPullRequestsCount('closed'),
      OctokitLayer.user(username).getPullRequestsCount('draft'),
      OctokitLayer.user(username).getPullRequestsCount('merged'),
      OctokitLayer.user(username).getPullRequestsCount('open'),
      OctokitLayer.user(username).getPullRequestsCount('reviewed'),
    ]),
    Effect.map(
      ([
        closedPullRequests,
        draftPullRequests,
        mergedPullRequests,
        openPullRequests,
        reviewedPullRequests,
      ]) => ({
        opened: openPullRequests,
        closed: closedPullRequests,
        drafts: draftPullRequests,
        merged: mergedPullRequests,
        reviewed: reviewedPullRequests,
      }),
    ),
    Console.withTime(`☑️  Fetched ${greenBright(username)} pull requests count`),
    Effect.withSpan('get-user-pull-requests-count', {
      attributes: { username },
    }),
  );
