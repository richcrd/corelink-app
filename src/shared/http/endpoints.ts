export const ENDPOINTS = {
  auth: {
    login: "/service/auth/login",
    register: "/service/auth/register",
  },
  catalog: {
    locationsByDepartment: (departmentId: string) =>
      `/service/location/by-department/${departmentId}`,
    categories: "/categories",
    products: "/products",
  },
};
