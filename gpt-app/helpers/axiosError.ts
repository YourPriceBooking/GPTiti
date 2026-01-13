function formatAxiosError(e: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = e as any;
  return {
    name: err?.name,
    message: err?.message,
    code: err?.code,
    status: err?.response?.status,
    statusText: err?.response?.statusText,
    method: err?.config?.method,
    url: err?.config?.url,
    data: err?.response?.data,
  };
}
export { formatAxiosError };