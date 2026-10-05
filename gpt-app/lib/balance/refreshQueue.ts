// A notification during GET schedules a trailing GET. Simply sharing the first
// request could miss a transfer that committed after that request's DB read.
export function createRefreshQueue<T>(read: (signal: AbortSignal) => Promise<T>) {
  const controller = new AbortController();
  let dirty = false;
  let flight: Promise<T> | null = null;
  let disposed = false;
  return {
    request(): Promise<T> {
      if (disposed) return Promise.reject(new Error("Balance refresh cancelled"));
      dirty = true;
      if (flight) return flight;
      flight = (async () => {
        let result: T;
        do {
          dirty = false;
          result = await read(controller.signal);
          if (disposed) throw new Error("Balance refresh cancelled");
        } while (dirty);
        return result;
      })().finally(() => { flight = null; });
      return flight;
    },
    cancel() {
      disposed = true;
      controller.abort();
    },
  };
}
