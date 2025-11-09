import { useQuery } from "@tanstack/react-query";

export interface NeynarUser {
  fid: number;
  score: number;
}

async function fetchNeynarUser(fid: number): Promise<NeynarUser | null> {
  const response = await fetch(`/api/users?fids=${fid}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data.users?.[0] || null;
}

export function useNeynarUser(context?: { user?: { fid?: number } }) {
  const fid = context?.user?.fid;

  const { data: user, isLoading: loading, error } = useQuery({
    queryKey: ["neynar-user", fid],
    queryFn: () => fetchNeynarUser(fid!),
    enabled: !!fid,
  });

  return {
    user: user ?? null,
    loading,
    error: error ? (error as Error).message : null,
  };
}