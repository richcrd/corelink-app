import { useQuery } from "@tanstack/react-query";
import { branchRepository } from "../api/branches.repository";

export function useBranches(departmentId: number) {
  return useQuery({
    queryKey: ["locations", departmentId],
    queryFn: () => branchRepository.getByDepartment(departmentId),
    enabled: departmentId > 0,
    refetchOnMount: "always",
  });
}
