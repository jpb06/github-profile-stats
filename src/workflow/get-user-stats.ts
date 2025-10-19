import { Effect, pipe } from 'effect';

import {
  getReposLanguagesBytes,
  getReposReleases,
  getReposTags,
  getUserCommitsCount,
  getUserIssues,
  getUserProfile,
  getUserPullRequestsComments,
  getUserPullRequestsCount,
  getUserRepos,
} from '../fetchers/index.js';
import { saveStats } from '../file-system/index.js';
import { mergeReactions } from '../reactions/merge-reactions.js';
import { mapUserStats } from './map-user-stats.js';

export const getUserStats = (username: string, verbose = false) =>
  pipe(
    Effect.gen(function* () {
      const userPullRequestsCount = yield* getUserPullRequestsCount(username);
      const userCommitsCount = yield* getUserCommitsCount(username);
      const { issues, reactions: issuesReactions } = yield* getUserIssues(
        username,
        verbose,
      );

      const profile = yield* getUserProfile(username);
      const { userRepos, userReposStats } = yield* getUserRepos(username);

      const languagesBytes = yield* getReposLanguagesBytes(userRepos, verbose);
      const tags = yield* getReposTags(userRepos, verbose);
      const releases = yield* getReposReleases(userRepos, verbose);

      const { comments, reactions: commentsReactions } =
        yield* getUserPullRequestsComments(username, verbose);

      const reactions = mergeReactions([commentsReactions, issuesReactions]);

      const stats = mapUserStats({
        profile,
        userReposStats,
        languagesBytes,
        comments,
        reactions,
        tags,
        userRepos,
        userCommitsCount,
        userPullRequestsCount,
        releases,
        issues,
      });

      yield* saveStats(username, stats);
    }),
    Effect.withSpan('get-user-stats', { attributes: { username, verbose } }),
  );
