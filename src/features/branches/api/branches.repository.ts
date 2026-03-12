import { ENDPOINTS } from "@/src/shared/http/endpoints";
import { get } from "@/src/shared/http/http";
import { BranchDto } from "../types/Branch";

export const branchRepository = {
  getByDepartment: (departmentId: number) =>
    get<BranchDto[]>(ENDPOINTS.branch.getByDepartment(departmentId)),
};
