// Parsed from: triton one mystery 5left CO 44 5bb nodelock.hrcz
// HRC (Holdem Resources Calculator) solver output

export const tournamentInfo = {
  event: "Triton Poker",
  scenario: "Mystery Event",
  playersLeft: 5,
  heroPosition: "CO (Cutoff)",
  heroHand: "4♠4♥",
  heroStack: "~5bb",
  format: "KO Bounty",
  nodelock: true,
  solver: "HRC Monte Carlo",
};

export const blindStructure = {
  ante: 120,
  smallBlind: 60,
  bigBlind: 120,
  anteType: "BB Ante (Blind First)",
  straddle: "OFF",
};

export const playerStacks = [
  { seat: 1, position: "UTG", chips: 2000, bb: (2000 / 120).toFixed(1) },
  { seat: 2, position: "HJ", chips: 580, bb: (580 / 120).toFixed(1) },
  { seat: 3, position: "CO", chips: 7300, bb: (7300 / 120).toFixed(1), isHero: true },
  { seat: 4, position: "BTN", chips: 2300, bb: (2300 / 120).toFixed(1) },
  { seat: 5, position: "BB", chips: 4600, bb: (4600 / 120).toFixed(1) },
];

export const prizePool = {
  bounty: 8000,
  prizes: {
    1: 395000,
    2: 240000,
    3: 169000,
    4: 127000,
    5: 99000,
  },
  totalPrizes: 395000 + 240000 + 169000 + 127000 + 99000,
};

export const equityData = {
  pre: [182920.94, 132541.97, 304158.90, 198451.87, 251926.32],
  post: [185074.34, 127305.54, 304275.56, 200144.54, 253200.03],
  positions: ["UTG", "HJ", "CO", "BTN", "BB"],
};

// ICM equity change (post - pre) for each player
export const icmImpact = equityData.positions.map((pos, i) => ({
  position: pos,
  pre: equityData.pre[i],
  post: equityData.post[i],
  change: equityData.post[i] - equityData.pre[i],
  changePercent: (((equityData.post[i] - equityData.pre[i]) / equityData.pre[i]) * 100).toFixed(2),
}));

export const preflopSizings = {
  open: {
    SB: "3.0bb",
    BU: "2.0bb",
    Others: "2.0bb",
    BB: "3.0bb",
    BB_vs_SB: "3.0bb",
  },
  threeBet: {
    IP: "2.5x + 1.0bb",
    BB_vs_SB: "8.0bb",
    BB_vs_Other: "3.0x + 1.0bb",
    SB_vs_BB: "2.9x + 1.0bb",
    SB_vs_Other: "3.0x + 1.0bb",
  },
  fourBet: {
    IP: "2.1x",
    OOP: "2.3x",
  },
  fiveBet: {
    IP: "2.1x",
    OOP: "2.2x",
  },
};

export const treeConfig = {
  allowColdCalls: false,
  allowSBComplete: true,
  preflopAllinSPR: 7.0,
  allinThreshold: 40,
  postflopGeo: [[33, 75], [33, 75]],
  postflopAllinSPR: [5.0, 5.0],
  allowDonk: [false, false],
};

export const engineConfig = {
  type: "Monte Carlo",
  maxActive: 4,
  abstractions: [
    { street: "Preflop", buckets: 169 },
    { street: "Flop", buckets: 1024 },
    { street: "Turn", buckets: 256 },
    { street: "River", buckets: 256 },
  ],
};
