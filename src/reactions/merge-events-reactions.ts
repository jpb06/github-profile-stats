import { emptyReactions } from './empty-reactions.state.js';
import type { Reactions } from './reactions.type.js';

type EventWithMaybeReactions = {
  reactions?: Reactions;
};

export const mergeEventsReactions = (
  eventWithReactions: EventWithMaybeReactions[],
) =>
  eventWithReactions.reduce<Reactions>(
    (result, comment) => {
      if (comment.reactions === undefined) {
        return result;
      }

      result['+1'] += comment.reactions['+1'];
      result['-1'] += comment.reactions['-1'];
      result.confused += comment.reactions.confused;
      result.eyes += comment.reactions.eyes;
      result.heart += comment.reactions.heart;
      result.hooray += comment.reactions.hooray;
      result.laugh += comment.reactions.laugh;
      result.rocket += comment.reactions.rocket;
      result.total_count += comment.reactions.total_count;

      return result;
    },
    { ...emptyReactions },
  );
