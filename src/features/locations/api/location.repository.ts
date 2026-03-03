import { ENDPOINTS } from "@/src/shared/http/endpoints";
import { get } from "@/src/shared/http/http";
import { LocationDto } from "../types/Location";

export const locationRepository = {
  getByDepartment: (departmentId: string) =>
    get<LocationDto[]>(ENDPOINTS.location.getByDepartment(departmentId)),
};
