import type { UserRepositoriesResult } from 'effect-octokit-layer';

type Topic = {
  count: number;
  name: string;
};

export type UserReposResult = {
  stargazers: number;
  forks: number;
  watchers: number;
  openIssues: number;
  topics: Topic[];
  sizeInKb: number;
};

export const mapUserReposResult = (repos: UserRepositoriesResult) =>
  repos.reduce<UserReposResult>(
    (result, repo) => {
      const repoStargazers = repo.stargazers_count ?? 0;
      const repoForks = repo.forks_count ?? 0;
      const repoWatchers = repo.watchers_count ?? 0;
      const repoOpenIssues = repo.open_issues_count ?? 0;

      for (const topic of repo.topics ?? []) {
        const maybeAddedTopic = result.topics.find((t) => t.name === topic);
        if (maybeAddedTopic) {
          maybeAddedTopic.count += 1;
        } else {
          result.topics.push({ name: topic, count: 1 });
        }
      }

      return {
        stargazers: result.stargazers + repoStargazers,
        forks: result.forks + repoForks,
        watchers: result.watchers + repoWatchers,
        openIssues: result.openIssues + repoOpenIssues,
        sizeInKb: result.sizeInKb + (repo.size ?? 0),
        topics: result.topics,
      };
    },
    {
      stargazers: 0,
      forks: 0,
      watchers: 0,
      openIssues: 0,
      topics: [],
      sizeInKb: 0,
    },
  );
