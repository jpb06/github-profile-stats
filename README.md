# github-profile-stats

Fetching user activity on github using an effect layer relying on octokit.

![console](./assets/console.png)

## Output type

```ts
type Topic = { name: string; count: number };

type LanguagesBytes = Record<string, number>;

type Reactions = {
  total_count: number;
  '+1': number;
  '-1': number;
  laugh: number;
  confused: number;
  heart: number;
  hooray: number;
  eyes: number;
  rocket: number;
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
```

## Env

```bash
GITHUB_TOKEN="xxx"
```

## Install dependencies

```bash
bun install
```

## run script

```bash
bun dev
```
