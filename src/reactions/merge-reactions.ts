import { emptyReactions } from './empty-reactions.state.js';
import type { Reactions } from './reactions.type.js';

export const mergeReactions = (reactions: Reactions[]) =>
  reactions.reduce<Reactions>(
    (result, entry) => {
      result['+1'] += entry['+1'];
      result['-1'] += entry['-1'];
      result.confused += entry.confused;
      result.eyes += entry.eyes;
      result.heart += entry.heart;
      result.hooray += entry.hooray;
      result.laugh += entry.laugh;
      result.rocket += entry.rocket;
      result.total_count += entry.total_count;

      return result;
    },
    { ...emptyReactions },
  );
