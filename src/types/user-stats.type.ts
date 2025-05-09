import type { Reactions } from '../reactions/reactions.type.js';

type Topic = { name: string; count: number };

type LanguagesBytes = Record<string, number>;

type DayActivity = {
  commitsCreated: number;
  pullRequestsCreated: number;
  issuesCreated: number;
  commentsCreated: number;
};

export type GithubUserStats = {
  name: string | null;
  onGithubSince: string;
  location: string | null;
  company: string | null;
  sizeInKb: number;
  bytesByLanguage: LanguagesBytes;
  social: {
    orgs: number;
    following: number;
    followers: number;
    stargazers: number;
    watchers: number;
    reactions: Reactions;
    comments: number;
  };
  activityPerDay: Record<string, DayActivity>;
  git: {
    publicRepos: number;
    publicGists: number;
    forks: number;
    tags: number;
    commits: number;
    issues: {
      opened: number;
      closed: number;
    };
    pullRequests: {
      opened: number;
      reviewed: number;
      drafts: number;
      closed: number;
      merged: number;
    };
    releases: number;
  };
  topics: Topic[];
};
