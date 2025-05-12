import { Console, Effect, pipe } from 'effect';
import {
  type EffectResultSuccess,
  OctokitLayer,
  type RepoArgs,
} from 'effect-octokit-layer';
import colors from 'picocolors';

import { mergeEventsReactions } from '../../reactions/merge-events-reactions.js';

export type GetUserPullRequestsCommentsResult = EffectResultSuccess<
  typeof getUserPullRequestsComments
>;

export const getUserPullRequestsComments = (
  username: string,
  repos: RepoArgs[],
  verbose: boolean,
) =>
  pipe(
    Effect.gen(function* () {
      const userComments = yield* pipe(
        Effect.forEach(repos, (repo) =>
          Effect.gen(function* () {
            const { pulls } = OctokitLayer.repo(repo);

            if (verbose) {
              yield* Console.info(
                `- ℹ️  Getting pull requests comments for ${colors.greenBright(`${repo.owner}/${repo.repo}`)}.`,
              );
            }
            const repoPullsRequestsComments = yield* pulls.comments(2);
            return repoPullsRequestsComments.filter(
              (comment) => comment.user.login === username,
            );
          }),
        ),
      );

      const allComments = userComments.flat();
      const reactions = mergeEventsReactions(allComments);

      return { reactions, comments: allComments };
    }),
    Console.withTime(
      `☑️  Fetching ${colors.greenBright(username)} pull requests comments`,
    ),
    Effect.withSpan('get-user-pull-requests-comments', {
      attributes: { username },
    }),
  );
