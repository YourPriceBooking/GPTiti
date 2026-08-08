let inFlight: Promise<string> | null = null;

export const runSingleFlightRefresh = (
  start: () => Promise<string>,
): Promise<string> => {
  if (inFlight) return inFlight;

  const request = start();
  inFlight = request;

  const release = () => {
    if (inFlight === request) inFlight = null;
  };
  request.then(release, release);

  return request;
};
