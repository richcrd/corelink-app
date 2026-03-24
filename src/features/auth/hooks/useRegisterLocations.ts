import { useMemo } from "react";
import { useBranches } from "../../branches/hooks/useBranches";
import type { SelectOption } from "@/src/presentation/components/Select";

export function useRegisterLocations(departmentId: number) {
  const { data: locations = [], isPending, refetch } = useBranches(departmentId);

  const options: SelectOption<number>[] = useMemo(
    () =>
      locations.map((l) => ({
        label: l.name,
        value: l.id,
      })),
    [locations],
  );

  function handleOpen() {
    if (!locations.length) {
      refetch();
    }
  }

  return {
    locationOptions: options,
    loadingLocations: isPending,
    handleOpen,
  };
}
