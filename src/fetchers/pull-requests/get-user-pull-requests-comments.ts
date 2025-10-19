import { Console, Effect, pipe } from 'effect';
import { type EffectResultSuccess, OctokitLayer } from 'effect-octokit-layer';
import colors from 'picocolors';

import { mergeEventsReactions } from '../../reactions/merge-events-reactions.js';

export type GetUserPullRequestsCommentsResult = EffectResultSuccess<
  typeof getUserPullRequestsComments
>;

export const getUserPullRequestsComments = (
  username: string,
  verbose: boolean,
) =>
  pipe(
    Effect.gen(function* () {
      const userPullRequests = yield* OctokitLayer.user(username).searchIssues(
        'is:pr',
        false,
        1,
      );

      const userComments = yield* Effect.forEach(
        userPullRequests.data,
        (pull) =>
          Effect.gen(function* () {
            const [owner, repo] = pull.repository_url.split('/').slice(-2);

            if (verbose) {
              yield* Console.info(
                `- ℹ️  Getting ${colors.greenBright(`${owner}/${repo}`)} pull request ${pull.number} comments.`,
              );
            }
            const comments = yield* OctokitLayer.repo({
              owner,
              repo,
            })
              .issue(pull.number)
              .comments(1);

            return comments.filter(
              (comment) => comment.user?.login === username,
            );
          }),
      );

      const comments = userComments.flat();

      return {
        comments,
        reactions: mergeEventsReactions(comments),
      };
    }),
    Console.withTime(
      `☑️  Fetching ${colors.greenBright(username)} pull requests comments`,
    ),
    Effect.withSpan('get-user-pull-requests-comments', {
      attributes: { username },
    }),
  );
