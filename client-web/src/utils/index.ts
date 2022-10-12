import * as React from "react";
import { useLocation } from "react-router-dom";

export function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
export const truncateString = (input: string, textLength: number) => {
  return input.length > textLength
    ? `${input.substring(0, textLength)}...`
    : input;
};
