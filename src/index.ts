import { FetchHttpClient } from '@effect/platform';
import { NodeContext } from '@effect/platform-node';
import { Effect, Layer, pipe } from 'effect';
import { runPromise } from 'effect-errors';
import { OctokitLayerLive } from 'effect-octokit-layer';

import { getUserStats } from './workflow/get-user-stats.js';

await runPromise(
  pipe(
    getUserStats('jpb06', true),
    Effect.provide(
      Layer.mergeAll(
        NodeContext.layer,
        FetchHttpClient.layer,
        OctokitLayerLive,
      ),
    ),
  ),
  { hideStackTrace: true, stripCwd: true },
);
