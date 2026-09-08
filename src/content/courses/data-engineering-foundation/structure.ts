// Stable IDs, ordering and prerequisites shared by both languages.
export const STRUCTURE = {
  parts: [
    {
      id: "engineering-core",
      color: "var(--green)"
    },
    {
      id: "reliable-services",
      color: "var(--cyan)"
    },
    {
      id: "data-platform",
      color: "var(--purple)"
    },
    {
      id: "processing-and-operation",
      color: "var(--yellow)"
    }
  ],
  sessions: [
    {
      id: "b1",
      week: 1,
      part: 0,
      prerequisiteIds: []
    },
    {
      id: "b2",
      week: 2,
      part: 0,
      prerequisiteIds: [
        "b1"
      ]
    },
    {
      id: "b3",
      week: 3,
      part: 0,
      prerequisiteIds: [
        "b2"
      ]
    },
    {
      id: "b4",
      week: 4,
      part: 1,
      prerequisiteIds: [
        "b2",
        "b3"
      ]
    },
    {
      id: "b5",
      week: 5,
      part: 1,
      prerequisiteIds: [
        "b2",
        "b3",
        "b4"
      ]
    },
    {
      id: "b6",
      week: 6,
      part: 1,
      prerequisiteIds: [
        "b1",
        "b4",
        "b5"
      ]
    },
    {
      id: "b7",
      week: 7,
      part: 2,
      prerequisiteIds: [
        "b3",
        "b4",
        "b6"
      ]
    },
    {
      id: "b8",
      week: 8,
      part: 2,
      prerequisiteIds: [
        "b3",
        "b7"
      ]
    },
    {
      id: "b9",
      week: 9,
      part: 3,
      prerequisiteIds: [
        "b2",
        "b3",
        "b6",
        "b8"
      ]
    },
    {
      id: "b10",
      week: 10,
      part: 3,
      prerequisiteIds: [
        "b7",
        "b8",
        "b9"
      ]
    },
    {
      id: "b11",
      week: 11,
      part: 3,
      prerequisiteIds: [
        "b3",
        "b8",
        "b9",
        "b10"
      ]
    },
    {
      id: "b12",
      week: 12,
      part: 3,
      prerequisiteIds: [
        "b5",
        "b6",
        "b9",
        "b10",
        "b11"
      ]
    }
  ]
} as const;
