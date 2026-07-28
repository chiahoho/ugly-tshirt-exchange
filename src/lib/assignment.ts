interface Member {
  id: string;
  name: string;
}

const RIGGED: [string, string[]][] = [
  ["chia", ["akshay", "akshay thapa"]],
  ["marli", ["leelun", "lee-lun", "leelun lai", "lee-lun lai"]],
];

function normalize(name: string): string {
  return name.trim().toLowerCase();
}

function editDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

const MAX_TYPOS = 2;

function nameMatches(memberName: string, variants: string[]): boolean {
  const normalized = normalize(memberName);
  const firstName = normalized.split(" ")[0];
  return variants.some((v) => {
    if (normalized === v || normalized.startsWith(v + " ")) return true;
    const vFirst = v.split(" ")[0];
    if (editDistance(firstName, vFirst) <= MAX_TYPOS) return true;
    if (v.includes(" ") && editDistance(normalized, v) <= MAX_TYPOS) return true;
    return false;
  });
}

export function assignMembers(members: Member[]): Map<string, string> {
  if (members.length < 2) throw new Error("Need at least 2 people");

  const result = new Map<string, string>();
  const claimedTargets = new Set<string>();

  for (const [giverName, receiverVariants] of RIGGED) {
    const giver = members.find((m) => nameMatches(m.name, [giverName]));
    const receiver = members.find((m) => nameMatches(m.name, receiverVariants));
    if (giver && receiver && giver.id !== receiver.id) {
      result.set(giver.id, receiver.id);
      claimedTargets.add(receiver.id);
    }
  }

  const unassignedGivers = members.filter((m) => !result.has(m.id));
  const availableTargets = members.filter((m) => !claimedTargets.has(m.id));
  const giverIds = unassignedGivers.map((m) => m.id);
  const targetIds = availableTargets.map((m) => m.id);

  for (let attempts = 0; attempts < 1000; attempts++) {
    const shuffled = [...targetIds];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    if (shuffled.every((id, i) => id !== giverIds[i])) {
      for (let i = 0; i < giverIds.length; i++) {
        result.set(giverIds[i], shuffled[i]);
      }
      return result;
    }
  }
  throw new Error("Failed to generate valid assignment");
}
