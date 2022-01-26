export const isEmptyPathParams = (pathParameters: any) => {
  return pathParameters === null || pathParameters === undefined;
};

export const isEmptyBody = (body: any) => {
  return body === null || body === undefined;
};

// TODO: We can check for the format or the length too to avoid DB calls
export const validContractId = (contractId: string | null | undefined) => {
  return contractId !== null && contractId !== undefined && contractId.trim().length > 0;
};
