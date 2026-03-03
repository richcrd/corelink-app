const AUTH_BASE = `/service/auth`;
const PRODUCT_CATEGORY_BASE = `/service/product-category`;
const LOCATION_BASE = `/service/location`;
const PRODUCTS_BASE = `/service/product`

export const ENDPOINTS = {
  auth: {
    login: `${AUTH_BASE}/login`,
    register: `${AUTH_BASE}/register`,
  },

  productCategory: {
    getAll: PRODUCT_CATEGORY_BASE,
    getById: (id: string) => `${PRODUCT_CATEGORY_BASE}/${id}`,
  },

  location: {
    getByDepartment: (departmentId: string) =>
      `${LOCATION_BASE}/by-department/${departmentId}`,
  },

  product: {
    getByBranch: (branchId: string) =>
      `${PRODUCTS_BASE}/branch/${branchId}`
  }
} as const;
