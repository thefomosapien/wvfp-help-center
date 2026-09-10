// Static help-center content, organized by WVFP age division -> subcategory.
// This is a curated, human-readable reference rendered directly in the UI (no
// AI call). It reflects WVFP's current per-division playing rules (the 2026
// update), weighted the same way the assistant is: WVFP's own rules are
// primary, D1 Prospects rules apply to sanctioned tournaments, and any general
// softball rule (NFHS) is summarized in plain language rather than quoted.
//
// Source tags:
//   'wvfp' — WVFP's own current division playing rules / league rules
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

export const DISCLAIMER =
  'This reference reflects WVFP’s current division playing rules, along with D1 Prospects’ tournament rules and general softball rules. It’s a convenience tool, not an official ruling — confirm anything critical with the WVFP Board. For anything not covered here, use the search bar to ask the assistant.';

// Lineup/attendance handling shared by the player-pitch divisions.
const LINEUP_FACTS: Fact[] = [
  { text: 'Teams bat all players present. A player in the lineup who is absent for her at-bat takes an out each time her spot comes up until she arrives.', source: 'wvfp' },
  { text: 'A coach may remove an absent player from the lineup (she then may not be re-added); a player who becomes sick or injured may not reenter the game.', source: 'wvfp' },
  { text: 'Courtesy runners may be used for the pitcher and catcher.', source: 'wvfp' },
];

const ADMIN_FACTS: Fact[] = [
  { text: 'The home team is responsible for prepping and chalking/lining the field.', source: 'wvfp' },
  { text: 'Each team keeps score; the umpire’s scorecard is the official score if there’s a discrepancy.', source: 'wvfp' },
  { text: 'Coaches bring a complete lineup card (coach name, team name/number, player names, jersey numbers) to the plate before the game.', source: 'wvfp' },
  { text: 'Teams may not warm up on the infield — outfield or foul territory only.', source: 'wvfp' },
];

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
          { text: 'Ball: 11-inch softball.', source: 'wvfp' },
        ],
      },
      {
        id: 'format',
        title: 'Game Format',
        facts: [
          { text: 'No new inning starts after 55 minutes.', source: 'wvfp' },
          { text: 'A half-inning ends at 3 outs or 5 runs, whichever comes first — only an over-the-fence home run may exceed 5.', source: 'wvfp' },
          { text: 'Teams bat all players present; an absent player in the lineup takes an out each time her spot comes up until she arrives.', source: 'wvfp' },
          { text: 'The home team preps and chalks the field; each team keeps score and the umpire’s scorecard is official if they disagree.', source: 'wvfp' },
        ],
      },
      {
        id: 'pitching',
        title: 'Pitching (Coach Pitch)',
        facts: [
          { text: 'A coach pitches underhand to their own team and must stay in contact with the pitching mound.', source: 'wvfp' },
          { text: 'Each batter gets 5 pitches or 3 strikes; a foul on the last pitch extends the at-bat.', source: 'wvfp' },
          { text: 'The coach-pitcher may only talk to batters/runners between pitches; interfering with a batted ball makes the batter/runner out and returns runners.', source: 'wvfp' },
        ],
      },
      {
        id: 'equipment',
        title: 'Equipment',
        facts: [
          { text: '11-inch softball.', source: 'wvfp' },
          { text: 'Metal cleats are not allowed in 8U.', source: 'wvfp' },
          { text: 'Face masks are encouraged but not required.', source: 'wvfp' },
          { text: 'A batting helmet (provided by WVFP) is required when batting; catchers must wear a mask.', source: 'wvfp' },
        ],
      },
      {
        id: 'notes',
        title: 'Division Notes',
        facts: [
          { text: 'No stealing, no walks or hit-by-pitch, and no dropped-third-strike rule.', source: 'wvfp' },
          { text: 'No intentional bunting and no infield fly rule.', source: 'wvfp' },
          { text: 'A tee may be used in Games 1–5 only, and only the first time through the lineup; from Game 6 on, no tee.', source: 'wvfp' },
          { text: 'Defense: 6 infielders start behind the 35-foot arc until the ball is hit; everyone else plays the outfield on the grass. One instructional defensive coach is allowed in the outfield (not during the end-of-season tournament).', source: 'wvfp' },
          { text: 'Runners advance one base on an infield hit unless a throw is misplayed or overthrown, and may score from third only on a batted ball.', source: 'wvfp' },
          { text: 'Players must be 8 or younger as of September 1 of the previous year and may not play down.', source: 'wvfp' },
        ],
      },
      {
        id: 'tournament',
        title: 'Tournament Play (D1)',
        facts: [
          { text: 'In D1-sanctioned tournaments, the 8U championship game runs about 60 minutes.', source: 'd1' },
          { text: 'Pool play caps each team at 6 runs per half inning (an over-the-fence home run can exceed it).', source: 'd1' },
          { text: 'A team may play short-handed with at least 8 batters (an out is taken for the empty spot); below 8 is a forfeit.', source: 'd1' },
          { text: 'Metal cleats are not permitted for 8U at D1 tournaments.', source: 'd1' },
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
          { text: 'Ball: 11-inch softball.', source: 'wvfp' },
        ],
      },
      {
        id: 'format',
        title: 'Game Format',
        facts: [
          { text: 'No new inning starts after 55 minutes.', source: 'wvfp' },
          { text: 'A half-inning ends at 3 outs or 5 runs, whichever comes first — only an over-the-fence home run may exceed 5.', source: 'wvfp' },
          ...LINEUP_FACTS,
          ...ADMIN_FACTS,
        ],
      },
      {
        id: 'pitching',
        title: 'Pitching',
        facts: [
          { text: 'Players pitch — coach pitch is not allowed.', source: 'wvfp' },
          { text: 'Hit-batter limit: a pitcher must leave the pitching position after hitting 2 batters in the same inning (she may play another position and return to pitch in a later inning).', source: 'wvfp' },
          { text: 'After returning, she must leave the pitching position again after every 3 additional batters she hits, for the rest of the game.', source: 'wvfp' },
        ],
      },
      {
        id: 'equipment',
        title: 'Equipment',
        facts: [
          { text: '11-inch softball.', source: 'wvfp' },
          { text: 'Metal cleats are not allowed in 10U.', source: 'wvfp' },
          { text: 'Face masks are encouraged but not required.', source: 'wvfp' },
          { text: 'A batting helmet (provided by WVFP) is required when batting; catchers must wear a mask.', source: 'wvfp' },
        ],
      },
      {
        id: 'notes',
        title: 'Division Notes',
        facts: [
          { text: 'Stealing is allowed after the ball leaves the pitcher’s hand — any base, including home, at the runner’s own risk.', source: 'wvfp' },
          { text: '10U scoring restriction: a runner may not score from third on a wild pitch from the pitcher to the catcher. She may score from third on a batted ball, a defensive play/throw, or by stealing home when the defense makes a play.', source: 'wvfp' },
          { text: 'Dropped third strike is in effect: with fewer than 2 outs and first base open, the batter may try for first if it isn’t caught; with first base occupied she’s out; with 2 outs, the batter and runners may advance at their own risk.', source: 'wvfp' },
          { text: 'Defense: up to 4 outfielders and 6 infielders; outfielders stay on the grass until the ball crosses the plate.', source: 'wvfp' },
          { text: 'Players must be 10 or younger as of September 1 of the previous year and may not play down.', source: 'wvfp' },
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
          { text: 'Ball: 12-inch softball.', source: 'wvfp' },
        ],
      },
      {
        id: 'format',
        title: 'Game Format',
        facts: [
          { text: 'No new inning starts after 55 minutes.', source: 'wvfp' },
          { text: 'A half-inning ends at 3 outs or 6 runs, whichever comes first — only an over-the-fence home run may exceed 6.', source: 'wvfp' },
          ...LINEUP_FACTS,
          ...ADMIN_FACTS,
        ],
      },
      {
        id: 'pitching',
        title: 'Pitching',
        facts: [
          { text: 'Players pitch — coach pitch is not allowed.', source: 'wvfp' },
        ],
      },
      {
        id: 'equipment',
        title: 'Equipment',
        facts: [
          { text: '12-inch softball.', source: 'wvfp' },
          { text: 'Metal cleats are not allowed in 12U.', source: 'wvfp' },
          { text: 'Face masks are encouraged but not required.', source: 'wvfp' },
          { text: 'A batting helmet (provided by WVFP) is required when batting; catchers must wear a mask.', source: 'wvfp' },
          { text: 'Bats must carry an approved certification mark and be free of alterations; an illegal or altered bat can get the player and head coach removed.', source: 'nfhs' },
        ],
      },
      {
        id: 'notes',
        title: 'Division Notes',
        facts: [
          { text: 'Stealing is allowed after the ball leaves the pitcher’s hand; runners may advance as many bases as they choose at their own risk.', source: 'wvfp' },
          { text: 'Dropped third strike is in effect.', source: 'wvfp' },
          { text: 'Defense: up to 4 outfielders and 6 infielders; outfielders stay on the grass until the ball crosses the plate.', source: 'wvfp' },
          { text: 'Coaches may not physically help runners stop or go; a runner contacted that way is called out.', source: 'wvfp' },
          { text: 'Players must be 12 or younger as of September 1 of the previous year and may not play down.', source: 'wvfp' },
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
          { text: 'Ball: 12-inch softball.', source: 'wvfp' },
        ],
      },
      {
        id: 'format',
        title: 'Game Format',
        facts: [
          { text: 'No new inning starts after 65 minutes.', source: 'wvfp' },
          { text: 'A half-inning ends at 3 outs or 6 runs, whichever comes first — only an over-the-fence home run may exceed 6.', source: 'wvfp' },
          ...LINEUP_FACTS,
          ...ADMIN_FACTS,
        ],
      },
      {
        id: 'pitching',
        title: 'Pitching',
        facts: [
          { text: 'Players pitch — coach pitch is not allowed.', source: 'wvfp' },
        ],
      },
      {
        id: 'equipment',
        title: 'Equipment',
        facts: [
          { text: '12-inch softball.', source: 'wvfp' },
          { text: 'Metal cleats ARE allowed for 14U and 18U players during spring, fall, and all-stars. (Younger divisions — 8U/10U/12U — may not wear metal cleats.)', source: 'wvfp' },
          { text: 'Face masks are encouraged but not required.', source: 'wvfp' },
          { text: 'A batting helmet (provided by WVFP) is required when batting; catchers must wear a mask.', source: 'wvfp' },
          { text: 'Bats must carry an approved certification mark and be free of alterations; an illegal or altered bat can get the player and head coach removed.', source: 'nfhs' },
        ],
      },
      {
        id: 'notes',
        title: 'Division Notes',
        facts: [
          { text: 'Stealing is allowed after the ball leaves the pitcher’s hand; runners may advance as many bases as they choose at their own risk.', source: 'wvfp' },
          { text: 'Dropped third strike is in effect.', source: 'wvfp' },
          { text: 'Defense: up to 4 outfielders and 6 infielders; outfielders stay on the grass until the ball crosses the plate.', source: 'wvfp' },
          { text: 'Coaches may not physically help runners stop or go; a runner contacted that way is called out.', source: 'wvfp' },
          { text: 'Players must be 18 or younger as of September 1 of the previous year and may not play down.', source: 'wvfp' },
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
