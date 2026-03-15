const AUTH_BASE = `/service/auth`;
const PRODUCT_CATEGORY_BASE = `/service/product-category`;
const BRANCH_BASE = `/service/branch`;
const PRODUCTS_BASE = `/service/product`

export const ENDPOINTS = {
  auth: {
    login: `${AUTH_BASE}/login`,
    register: `${AUTH_BASE}/register`,
  },

  productCategory: {
    getAll: PRODUCT_CATEGORY_BASE,
    getById: (id: number) => `${PRODUCT_CATEGORY_BASE}/${id}`,
  },

  branch: {
    getByDepartment: (departmentId: number) =>
      `${BRANCH_BASE}/by-department/${departmentId}`,
  },

  product: {
    getByBranch: (branchId: number) =>
      `${PRODUCTS_BASE}/branch/${branchId}`,
    getByBranchAndCategory: (branchId: number, categoryId: number, page: number = 1, pageSize: number = 10) =>
      `${PRODUCTS_BASE}/branch/${branchId}/category/${categoryId}?page=${page}&pageSize=${pageSize}`
  }
} as const;
