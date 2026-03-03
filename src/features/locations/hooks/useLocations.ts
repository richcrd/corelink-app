import { useQuery } from "@tanstack/react-query";
import { locationRepository } from "../api/location.repository";

export function useLocations(departmentId: string) {
  return useQuery({
    queryKey: ["locations", departmentId],
    queryFn: () => locationRepository.getByDepartment(departmentId),
    enabled: false,
  })
}
