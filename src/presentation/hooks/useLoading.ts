import { useEffect } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { useLoadingStore } from "../stores/loading.store";

export function useLoading() {
  const fetching = useIsFetching();
  const setLoading = useLoadingStore((s) => s.set);

  useEffect(() => {
    setLoading(fetching > 0);
  }, [fetching, setLoading]);
}
