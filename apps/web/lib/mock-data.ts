export const politicians = [
  {
    id: "p1",
    fullName: "Jordan Lee",
    party: "Independent",
    office: "U.S. House",
    state: "CA",
    district: "12",
    votingParticipation: 97.2,
    missedVotes: 12,
    billsSponsored: 21,
    topIndustries: ["Healthcare", "Technology", "Education"],
  },
  {
    id: "p2",
    fullName: "Casey Morgan",
    party: "Democratic",
    office: "U.S. Senate",
    state: "AZ",
    district: "At-large",
    votingParticipation: 95.4,
    missedVotes: 19,
    billsSponsored: 18,
    topIndustries: ["Energy", "Finance", "Labor"],
  },
];

export const matchup = {
  race: "2026 Arizona Senate",
  candidates: [
    { name: "Casey Morgan", party: "Democratic", raised: 12_400_000, attendance: 95.4 },
    { name: "Avery Reed", party: "Republican", raised: 11_700_000, attendance: 93.1 },
  ],
};
