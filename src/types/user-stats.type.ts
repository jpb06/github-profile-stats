import type { Reactions } from '../reactions/reactions.type.js';

export type Topic = { name: string; repos: string[]; weight: number };

export type LanguageBytes = { language: string; bytes: number };

export type GithubUserStats = {
  name: string | null;
  onGithubSince: string;
  location: string | null;
  company: string | null;
  sizeInKb: number;
  bytesByLanguage: LanguageBytes[];
  social: {
    orgs: number;
    following: number;
    followers: number;
    stargazers: number;
    watchers: number;
    reactions: Reactions;
    comments: number;
  };
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
  date: string;
};
