import { useQuery } from "@tanstack/react-query";
import { get } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";

export const DEFAULT_DEPARTMENT_ID = 1;

export type BranchDto = {
  id: number;
  name: string;
  departmentName: string;
};

const branchRepository = {
  getByDepartment: (departmentId: number) =>
    get<BranchDto[]>(requests.branch.getByDepartment(departmentId)),
};

export function useBranches(departmentId: number) {
  return useQuery({
    queryKey: ["locations", departmentId],
    queryFn: () => branchRepository.getByDepartment(departmentId),
    enabled: departmentId > 0,
    refetchOnMount: "always",
  });
}
