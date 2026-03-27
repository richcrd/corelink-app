export const requests = {
  auth: {
    login: `/service/auth/login`,
    register: `/service/auth/register`,
    refresh: `/service/auth/refresh`,
  },

  productCategory: {
    getAll: `/service/product-category`,
    getById: (id: number) => `/service/product-category/${id}`,
  },

  branch: {
    getByDepartment: (departmentId: number) =>
      `/service/branch/by-department/${departmentId}`,
  },

  product: {
    getByBranch: (branchId: number) =>
      `/service/product/branch/${branchId}`,
    getByBranchAndCategory: (branchId: number, categoryId: number, page: number = 1, pageSize: number = 10) =>
      `/service/product/branch/${branchId}/category/${categoryId}?page=${page}&pageSize=${pageSize}`,
    getTopWithPrice: (branchId: number) =>
      `/service/product/branch/${branchId}/top-with-price`,
  },

  cart: {
    get: `/service/cart`,
    addItem: `/service/cart/items`,
    updateItem: (branchProductId: number) => `/service/cart/items/${branchProductId}`,
    removeItem: (branchProductId: number) => `/service/cart/items/${branchProductId}`,
    clear: `/service/cart`,
  },

  checkout: {
    validate: `/service/checkout/validate`,
    process: `/service/checkout`,
  },

  paymentMethod: {
    getAll: `/service/paymentmethod`,
  },

  orders: {
    getMyOrders: `/service/orders`,
    getDetails: (orderId: number) => `/service/orders/${orderId}/details`,
  }

} as const;
