// Static help-center content, organized by WVFP age division -> subcategory.
// This is a curated, human-readable reference rendered directly in the UI (no
// AI call). Content is drawn from the same sources as the assistant and weighted
// the same way: WVFP's own Rules & Regulations are primary, D1 Prospects rules
// apply to sanctioned tournaments, and any general softball rule (NFHS) is
// summarized in plain language rather than quoted, and only where it adds value.
//
// Source tags:
//   'wvfp' — WVFP's own Rules & Regulations / By-Laws (regular season league play)
//   'd1'   — D1 Prospects Master Rules (D1-sanctioned tournaments)
//   'nfhs' — general high school softball rule, summarized (not WVFP-binding)

export type SourceTag = 'wvfp' | 'd1' | 'nfhs';

export const SOURCE_LABELS: Record<SourceTag, string> = {
  wvfp: 'WVFP',
  d1: 'D1 Tournament',
  nfhs: 'General',
};

export interface Fact {
  text: string;
  source: SourceTag;
}

export interface SubTopic {
  id: string;
  title: string;
  facts: Fact[];
}

export interface Division {
  id: string;
  name: string;
  ages: string;
  blurb: string;
  subtopics: SubTopic[];
}

// A note shown once at the top of the section, since several figures are dated.
export const DISCLAIMER =
  'This reference is drawn from WVFP’s rules, D1 Prospects’ tournament rules, and general softball rules. Some figures (fees, dates, and season-specific rules) may be out of date — confirm current specifics with the WVFP Board. For anything not covered here, use the search bar to ask the assistant.';

export const DIVISIONS: Division[] = [
  {
    id: '8u',
    name: '8U',
    ages: 'Ages 8 and under',
    blurb: 'Coach-pitch introduction to fast pitch, with simplified rules.',
    subtopics: [
      {
        id: 'field',
        title: 'Field & Distances',
        facts: [
          { text: 'Pitching distance: 35 feet.', source: 'wvfp' },
          { text: 'Base paths: 60 feet.', source: 'wvfp' },
          { text: 'Ball: 11-inch. An approved baseball, tee ball, or official softball may be used for batting.', source: 'wvfp' },
        ],
      },
      {
        id: 'format',
        title: 'Game Format',
        facts: [
          { text: 'Games are 55 minutes (shorter than the 70-minute standard for older divisions).', source: 'wvfp' },
          { text: 'Each side retires after 6 runs or three outs, whichever comes first.', source: 'wvfp' },
          { text: 'Games may end in a tie — both teams are credited with a win on the stat sheet.', source: 'wvfp' },
          { text: 'A team needs at least 8 players to hold a legitimate game; playing with 8, an out is recorded for the missing 9th spot each time through the order.', source: 'wvfp' },
          { text: 'No division champion is crowned in 8U.', source: 'wvfp' },
        ],
      },
      {
        id: 'pitching',
        title: 'Pitching (Coach Pitch)',
        facts: [
          { text: 'An adult from the batting team pitches; the coach-pitcher is not a defensive player and may not coach the batter while pitching.', source: 'wvfp' },
          { text: 'The adult pitcher must stay at least 30 feet from the plate to deliver the pitch.', source: 'wvfp' },
          { text: 'Each batter gets five pitches or three strikes. A foul on the last pitch earns another pitch; no one is out on a foul ball.', source: 'wvfp' },
          { text: 'No base is awarded for being hit by a pitch.', source: 'wvfp' },
        ],
      },
      {
        id: 'equipment',
        title: 'Equipment',
        facts: [
          { text: '11-inch ball.', source: 'wvfp' },
          { text: 'Metal cleats are not allowed at any WVFP activity, for any age.', source: 'wvfp' },
          { text: 'A batting helmet (provided by WVFP) is required when batting; catchers must wear a mask.', source: 'wvfp' },
        ],
      },
      {
        id: 'notes',
        title: 'Division Notes',
        facts: [
          { text: 'Runners may only score on a batted ball; no stealing, and a batter may not advance to first on a dropped third strike.', source: 'wvfp' },
          { text: 'No infield fly rule.', source: 'wvfp' },
          { text: 'On a ball hit in the infield, play continues until the runner reaches first, then the ball is dead; only one overthrow per batted ball is allowed.', source: 'wvfp' },
          { text: 'Safety rule: no defensive player may set up in front of the pitcher’s-plate line until the pitch is released.', source: 'wvfp' },
        ],
      },
      {
        id: 'tournament',
        title: 'Tournament Play (D1)',
        facts: [
          { text: 'In D1-sanctioned tournaments, the 8U championship game runs about 60 minutes.', source: 'd1' },
          { text: 'Pool play caps each team at 6 runs per half inning (an over-the-fence home run can exceed it).', source: 'd1' },
          { text: 'A team may play short-handed with at least 8 batters (an out is taken for the empty spot); below 8 is a forfeit.', source: 'd1' },
          { text: 'Metal cleats are not permitted for 8U at D1 tournaments either.', source: 'd1' },
        ],
      },
    ],
  },
  {
    id: '10u',
    name: '10U',
    ages: 'Ages 10 and under',
    blurb: 'First player-pitch division, with a few simplified rules.',
    subtopics: [
      {
        id: 'field',
        title: 'Field & Distances',
        facts: [
          { text: 'Pitching distance: 35 feet.', source: 'wvfp' },
          { text: 'Base paths: 60 feet.', source: 'wvfp' },
          { text: 'Ball: 11-inch.', source: 'wvfp' },
        ],
      },
      {
        id: 'format',
        title: 'Game Format',
        facts: [
          { text: 'Games are 70 minutes.', source: 'wvfp' },
          { text: 'A 6-run rule or mercy rule applies (as in every division).', source: 'wvfp' },
          { text: 'On a tie, 10U ends when time expires by finishing the inning — no extra inning is played.', source: 'wvfp' },
          { text: 'A team needs at least 8 players; playing with 8, an out is recorded for the missing 9th spot.', source: 'wvfp' },
        ],
      },
      {
        id: 'pitching',
        title: 'Pitching',
        facts: [
          { text: 'Players pitch. The standard limit is 12 pitching outs per week (a “week” is two consecutive scheduled games).', source: 'wvfp' },
          { text: 'Note: a recent season tested suspending pitch-count limits entirely — confirm the current season’s rule with the WVFP Board.', source: 'wvfp' },
          { text: 'Exceeding the pitching limit is a forfeit for the violating team.', source: 'wvfp' },
        ],
      },
      {
        id: 'equipment',
        title: 'Equipment',
        facts: [
          { text: '11-inch ball.', source: 'wvfp' },
          { text: 'Metal cleats are not allowed at any WVFP activity.', source: 'wvfp' },
          { text: 'A batting helmet (provided by WVFP) is required when batting; catchers must wear a mask.', source: 'wvfp' },
        ],
      },
      {
        id: 'notes',
        title: 'Division Notes',
        facts: [
          { text: 'No infield fly rule.', source: 'wvfp' },
          { text: 'Roving outfielders are allowed; all outfielders and the rover must stay at least 5 feet behind the baseline until the pitch is made.', source: 'wvfp' },
        ],
      },
      {
        id: 'tournament',
        title: 'Tournament Play (D1)',
        facts: [
          { text: 'D1 tournament pitching distance for 10U is 35 feet.', source: 'd1' },
          { text: 'The 10U championship game runs about 75 minutes (60 at some events).', source: 'd1' },
          { text: 'Pool play caps each team at 6 runs per half inning.', source: 'd1' },
          { text: 'Short-handed play (at least 8 batters) is allowed; metal cleats are not permitted for 10U.', source: 'd1' },
        ],
      },
    ],
  },
  {
    id: '12u',
    name: '12U',
    ages: 'Ages 12 and under',
    blurb: 'Full fast-pitch rules on a larger field.',
    subtopics: [
      {
        id: 'field',
        title: 'Field & Distances',
        facts: [
          { text: 'Pitching distance: 40 feet.', source: 'wvfp' },
          { text: 'Base paths: 60 feet.', source: 'wvfp' },
          { text: 'Ball: 12-inch.', source: 'wvfp' },
        ],
      },
      {
        id: 'format',
        title: 'Game Format',
        facts: [
          { text: 'Games are 70 minutes.', source: 'wvfp' },
          { text: 'A 6-run rule or mercy rule applies.', source: 'wvfp' },
          { text: 'On a tie, one extra inning is played using the International Tie Breaker; if still tied, each team earns one standings point.', source: 'wvfp' },
          { text: 'A team needs at least 8 players; playing with 8, an out is recorded for the missing 9th spot.', source: 'wvfp' },
        ],
      },
      {
        id: 'pitching',
        title: 'Pitching',
        facts: [
          { text: 'Standard limit is 12 pitching outs per week (a “week” is two consecutive scheduled games).', source: 'wvfp' },
          { text: 'Note: a recent season tested suspending pitch-count limits — confirm the current rule with the WVFP Board.', source: 'wvfp' },
          { text: 'Exceeding the pitching limit is a forfeit for the violating team.', source: 'wvfp' },
        ],
      },
      {
        id: 'equipment',
        title: 'Equipment',
        facts: [
          { text: '12-inch ball.', source: 'wvfp' },
          { text: 'Metal cleats are not allowed at any WVFP activity.', source: 'wvfp' },
          { text: 'A batting helmet (provided by WVFP) is required when batting; catchers must wear a mask.', source: 'wvfp' },
          { text: 'Bats must carry an approved certification mark and be free of alterations; an illegal or altered bat can get the player and head coach removed.', source: 'nfhs' },
        ],
      },
      {
        id: 'notes',
        title: 'Division Notes',
        facts: [
          { text: 'Play follows USA Softball rules except where WVFP’s own rules modify them.', source: 'wvfp' },
          { text: 'Roving outfielders are allowed; all outfielders and the rover must stay at least 5 feet behind the baseline until the pitch is made.', source: 'wvfp' },
        ],
      },
      {
        id: 'tournament',
        title: 'Tournament Play (D1)',
        facts: [
          { text: 'D1 tournament pitching distance for 12U is 40 feet.', source: 'd1' },
          { text: 'The 12U championship game runs about 80 minutes.', source: 'd1' },
          { text: 'Pool play caps each team at 6 runs per half inning; short-handed play (at least 8 batters) is allowed.', source: 'd1' },
          { text: 'Metal cleats are not permitted for 12U at D1 tournaments.', source: 'd1' },
        ],
      },
    ],
  },
  {
    id: '1418u',
    name: '14/18U',
    ages: 'Ages 14 to 18',
    blurb: 'Full-distance fast pitch for the older divisions.',
    subtopics: [
      {
        id: 'field',
        title: 'Field & Distances',
        facts: [
          { text: 'Pitching distance: 43 feet.', source: 'wvfp' },
          { text: 'Base paths: 60 feet.', source: 'wvfp' },
          { text: 'Ball: 12-inch.', source: 'wvfp' },
        ],
      },
      {
        id: 'format',
        title: 'Game Format',
        facts: [
          { text: 'Games are 70 minutes.', source: 'wvfp' },
          { text: 'A 6-run rule or mercy rule applies.', source: 'wvfp' },
          { text: 'On a tie, one extra inning is played using the International Tie Breaker; if still tied, each team earns one standings point.', source: 'wvfp' },
          { text: '14U needs at least 8 players (an out is recorded for the missing 9th spot); 18U needs only 7 (an out is recorded for the missing 8th spot).', source: 'wvfp' },
        ],
      },
      {
        id: 'pitching',
        title: 'Pitching',
        facts: [
          { text: 'Standard weekly pitching-out limit: 15 outs for 14U, 18 outs for 18U (a “week” is two consecutive scheduled games).', source: 'wvfp' },
          { text: 'Note: a recent season tested suspending pitch-count limits — confirm the current rule with the WVFP Board.', source: 'wvfp' },
          { text: 'Exceeding the pitching limit is a forfeit for the violating team.', source: 'wvfp' },
        ],
      },
      {
        id: 'equipment',
        title: 'Equipment',
        facts: [
          { text: '12-inch ball.', source: 'wvfp' },
          { text: 'Metal cleats ARE allowed for 14U and 18U players during spring, fall, and all-stars. (Younger divisions — 8U/10U/12U — may not wear metal cleats.)', source: 'wvfp' },
          { text: 'A batting helmet (provided by WVFP) is required when batting; catchers must wear a mask.', source: 'wvfp' },
          { text: 'Bats must carry an approved certification mark and be free of alterations; an illegal or altered bat can get the player and head coach removed.', source: 'nfhs' },
        ],
      },
      {
        id: 'notes',
        title: 'Division Notes',
        facts: [
          { text: 'Play follows USA Softball rules except where WVFP’s own rules modify them.', source: 'wvfp' },
          { text: 'Roving outfielders are allowed; all outfielders and the rover must stay at least 5 feet behind the baseline until the pitch is made.', source: 'wvfp' },
        ],
      },
      {
        id: 'tournament',
        title: 'Tournament Play (D1)',
        facts: [
          { text: 'D1 tournament pitching distance is 43 feet.', source: 'd1' },
          { text: 'Championship games run about 90 minutes.', source: 'd1' },
          { text: 'Metal cleats are also allowed for 14U/16U/18U at D1 tournaments.', source: 'd1' },
        ],
      },
    ],
  },
];
