import { Console, Effect, pipe } from 'effect';
import { type EffectResultSuccess, OctokitLayer } from 'effect-octokit-layer';
import { greenBright } from 'picocolors';

import { mergeEventsReactions } from '../../reactions/merge-events-reactions.js';

export type GetUserIssuesResult = EffectResultSuccess<typeof getUserIssues>;

export const getUserIssues = (username: string, verbose: boolean) =>
  pipe(
    Effect.gen(function* () {
      const issuesInvolvingUser = yield* OctokitLayer.user(
        username,
      ).searchIssues('', false, 1);
      const userIssues = issuesInvolvingUser.data.filter(
        (issue) => issue.user?.login === username,
      );

      const userComments = yield* Effect.forEach(
        issuesInvolvingUser.data,
        (issue) =>
          Effect.gen(function* () {
            const [owner, repo] = issue.repository_url.split('/').slice(-2);

            if (verbose) {
              yield* Console.info(
                `- ℹ️  Getting ${greenBright(`${owner}/${repo}`)} issue ${issue.number} comments.`,
              );
            }
            const comments = yield* OctokitLayer.repo({
              owner,
              repo,
            })
              .issue(issue.number)
              .comments(1);

            return comments.filter(
              (comment) => comment.user?.login === username,
            );
          }),
      );

      const reactions = mergeEventsReactions(userComments.flat());

      return {
        reactions,
        issues: {
          open: userIssues.filter((i) => i.state === 'open'),
          closed: userIssues.filter((i) => i.state === 'closed'),
        },
      };
    }),
    Console.withTime(`☑️  Fetched ${greenBright(username)} issues comments`),
    Effect.withSpan('get-user-issues', {
      attributes: { username },
    }),
  );
