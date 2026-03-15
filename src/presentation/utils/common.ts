export const formatCurrency = (value: number | string) => {
  return new Intl.NumberFormat("es-NI", {
    style: "currency",
    currency: "NIO",
  }).format(Number(value));
};
