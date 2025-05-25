export type ReactionKind =
  | '+1'
  | '-1'
  | 'laugh'
  | 'confused'
  | 'heart'
  | 'hooray'
  | 'eyes'
  | 'rocket';

export type ReactionKindWithTotal = ReactionKind | 'total_count';

export type Reactions = Record<ReactionKindWithTotal, number>;
