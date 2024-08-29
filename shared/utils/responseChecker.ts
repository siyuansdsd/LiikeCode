import { BadRequestError, UnexpectedError } from "../../src/common/common";

export const responseChecker = (response: any, entityName: string) => {
  responseStatusCodeChecker(response);
  if (!response[entityName]) {
    return new BadRequestError(`${entityName} not found`).response();
  }
};

export const responseStatusCodeChecker = (response: any) => {
  if (response.statusCode === 500) {
    return new UnexpectedError(response.errorMessage).response();
  }
};
