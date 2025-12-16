"use client";

import { Activity, ActivityCalendar } from "react-activity-calendar";
import { memo, useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * Props for the GitHub contribution graph component
 */
type GithubGraphProps = {
  username: string;
  blockMargin?: number;
  lightColorPalette?: string[];
  darkColorPalette?: string[];
};

type GithubApiResponse = {
  data: Activity[];
  error?: string;
};

const DEFAULT_LIGHT_PALETTE = [
  "#ebedf0",
  "#9be9a8",
  "#40c463",
  "#30a14e",
  "#216e39",
];

const DEFAULT_DARK_PALETTE = [
  "#1e1e2f",
  "#5a3e7a",
  "#7e5aa2",
  "#a87cc3",
  "#d9a9e6",
];

export const GithubGraph = memo(
  ({
    username,
    blockMargin,
    lightColorPalette = DEFAULT_LIGHT_PALETTE,
    darkColorPalette = DEFAULT_DARK_PALETTE,
  }: GithubGraphProps) => {
    const [contribution, setContribution] = useState<Activity[]>([]);
    const [loading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const fetchData = useCallback(async () => {
      try {
        setError(null);
        setIsLoading(true);
        const contributions = await fetchContributionData(username);
        setContribution(contributions);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch contribution data"
        );
        setContribution([]);
      } finally {
        setIsLoading(false);
      }
    }, [username]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    const label = {
      totalCount: `{{count}} contributions in the last year`,
    };

    if (!mounted) {
      return (
        <div className="h-[140px] flex items-center justify-center text-neutral-500">
          Loading GitHub activity…
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 p-4 text-center">Error: {error}</div>;
    }

    return (
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
          </div>
        )}

        <ActivityCalendar
          data={contribution}
          maxLevel={4}
          blockMargin={blockMargin ?? 2}
          loading={loading}
          labels={label}
          theme={{
            light: lightColorPalette,
            dark: darkColorPalette,
          }}
          colorScheme={theme === "dark" ? "dark" : "light"}
        />
      </div>
    );
  }
);

GithubGraph.displayName = "GithubGraph";

async function fetchContributionData(username: string): Promise<Activity[]> {
  try {
    const response = await fetch(`https://github.vineet.pro/api/${username}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseBody: GithubApiResponse = await response.json();

    if (!responseBody.data) {
      throw new Error("No contribution data received");
    }

    return responseBody.data;
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return [];
  }
}
