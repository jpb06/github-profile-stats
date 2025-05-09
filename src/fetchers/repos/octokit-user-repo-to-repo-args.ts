import type { RepoArgs, UserRepositoriesResult } from 'effect-octokit-layer';

export const octokitUserRepoToLayerRepoArgs = ({
  owner,
  name,
}: UserRepositoriesResult[number]): RepoArgs => ({
  owner: owner.login,
  repo: name,
});
