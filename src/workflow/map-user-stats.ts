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
import type { GithubUserStats } from './user-stats.type.js';

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
}: UserStats): GithubUserStats => ({
  name: profile.name,
  onGithubSince: profile.created_at,
  location: profile.location,
  company: profile.company,
  sizeInKb: userReposStats.sizeInKb,
  bytesByLanguage: languagesBytes,
  topics: userReposStats.topics,
  social: {
    following: profile.following,
    followers: profile.followers,
    stargazers: userReposStats.stargazers,
    watchers: userReposStats.watchers,
    orgs: 0,
    comments: comments.length,
    reactions,
  },
  activityPerDay: {} as never,
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
});
