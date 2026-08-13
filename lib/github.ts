export type ContributionDay = {
  date: string;
  count: number;
  level: number;
};

export type ContributionsResponse = {
  total: number;
  days: ContributionDay[];
};

export async function getContributions(
  username: string,
  year: number
): Promise<ContributionsResponse> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) {
    throw new Error(`GitHub contributions API responded ${res.status}`);
  }
  const data = await res.json();
  return {
    total: data.total?.[String(year)] ?? 0,
    days: data.contributions ?? [],
  };
}

export type LatestActivity = {
  message: string;
  repo: string;
  date: string;
  url: string;
};

type GitHubEvent = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload?: { head?: string };
};

export async function getLatestActivity(
  username: string
): Promise<LatestActivity | null> {
  const res = await fetch(
    `https://api.github.com/users/${username}/events/public`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) {
    throw new Error(`GitHub events API responded ${res.status}`);
  }
  const events: GitHubEvent[] = await res.json();
  const push = events.find((e) => e.type === "PushEvent" && e.payload?.head);
  if (!push?.payload?.head) return null;

  const commitRes = await fetch(
    `https://api.github.com/repos/${push.repo.name}/commits/${push.payload.head}`,
    { next: { revalidate: 300 } }
  );
  if (!commitRes.ok) {
    throw new Error(`GitHub commit API responded ${commitRes.status}`);
  }
  const commitData = await commitRes.json();
  const message: string | undefined = commitData.commit?.message;
  if (!message) return null;

  return {
    message: message.split("\n")[0],
    repo: push.repo.name.split("/")[1] ?? push.repo.name,
    date: push.created_at,
    url: commitData.html_url as string,
  };
}
