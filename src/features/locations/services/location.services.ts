import { locationRepository } from "../api/location.repository";

const managua = "6da5c8f3-696e-42ca-8048-224fa5e4d204";

export async function getLocationsByDepartmentService(
  departmentId: string = managua,
) {
  if (!departmentId?.trim()) {
    throw new Error("El departamento es requerido");
  }

  return await locationRepository.getByDepartment(departmentId);
}
