import { useCallback, useState } from "react";
import { getLocationsByDepartmentService } from "../services/location.services";
import type { LocationDto } from "../types/Location";

export function useLocations(departmentId: string) {
  const [data, setData] = useState<LocationDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    if (loaded || loading) return;

    setLoading(true);

    try {
      const result = await getLocationsByDepartmentService(departmentId);
      setData(result);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [departmentId, loaded, loading]);

  return {
    locations: data,
    loading,
    load,
  };
}
