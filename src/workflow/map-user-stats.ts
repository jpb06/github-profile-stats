import { formatISO } from 'date-fns';
import type { UserProfileResult } from 'effect-octokit-layer';

import type {
  GetPullRequestsCountResult,
  GetReposLanguagesBytesResult,
  GetReposReleasesResult,
  GetReposTagsResult,
  GetUserIssuesResult,
  GetUserPullRequestsCommentsResult,
  GetUserReposResult,
  UserReposResult,
} from '../fetchers/index.js';
import type { Reactions } from '../reactions/reactions.type.js';
import type { GithubUserStats } from '../types/user-stats.type.js';

type UserStats = {
  profile: UserProfileResult;
  userReposStats: UserReposResult;
  languagesBytes: GetReposLanguagesBytesResult;
  comments: GetUserPullRequestsCommentsResult['comments'];
  reactions: Reactions;
  tags: GetReposTagsResult;
  userRepos: GetUserReposResult['userRepos'];
  userCommitsCount: number;
  userPullRequestsCount: GetPullRequestsCountResult;
  releases: GetReposReleasesResult;
  issues: GetUserIssuesResult['issues'];
};

export const mapUserStats = ({
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
}: UserStats): GithubUserStats => {
  const languagesSortedByBytesDesc = Object.keys(languagesBytes)
    .sort((a, b) => (languagesBytes[a] > languagesBytes[b] ? -1 : 1))
    .map((key) => ({
      language: key,
      bytes: languagesBytes[key],
    }));

  const sortedTopicsByDescendingWeight = userReposStats.topics.sort((a, b) =>
    a.weight > b.weight ? -1 : 1,
  );

  return {
    name: profile.name,
    onGithubSince: profile.created_at,
    location: profile.location,
    company: profile.company,
    sizeInKb: userReposStats.sizeInKb,
    bytesByLanguage: languagesSortedByBytesDesc,
    topics: sortedTopicsByDescendingWeight,
    social: {
      following: profile.following,
      followers: profile.followers,
      stargazers: userReposStats.stargazers,
      watchers: userReposStats.watchers,
      orgs: 0,
      comments: comments.length,
      reactions,
    },
    git: {
      publicRepos: profile.public_repos,
      publicGists: profile.public_gists,
      tags: tags.flatMap(({ tags }) => tags).length,
      commits: userCommitsCount,
      forks: userRepos.reduce((result, repo) => result + (repo.forks ?? 0), 0),
      issues: {
        closed: issues.closed.length,
        opened: issues.open.length,
      },
      pullRequests: userPullRequestsCount,
      releases: releases.flatMap(({ releases }) => releases).length,
    },
    date: formatISO(new Date()),
  };
};
