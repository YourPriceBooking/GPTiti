let inFlight: Promise<void> | null = null;

export const runSingleFlightRefresh = (
  start: () => Promise<void>,
): Promise<void> => {
  if (inFlight) return inFlight;

  const request = start();
  inFlight = request;

  const release = () => {
    if (inFlight === request) inFlight = null;
  };
  request.then(release, release);

  return request;
};
