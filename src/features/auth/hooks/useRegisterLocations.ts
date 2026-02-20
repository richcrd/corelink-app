import { useMemo } from "react";
import { useLocations } from "../../locations/hooks/useLocations";
import type { SelectOption } from "@/src/presentation/components/Select";

export function useRegisterLocations(departmentId: string) {
  const { locations, loading, load } = useLocations(departmentId);

  const options: SelectOption<string>[] = useMemo(
    () =>
      locations.map((l) => ({
        label: l.name,
        value: l.id,
      })),
    [locations],
  );

  function handleOpen() {
    load();
  }

  return {
    locationOptions: options,
    loadingLocations: loading,
    handleOpen,
  };
}
