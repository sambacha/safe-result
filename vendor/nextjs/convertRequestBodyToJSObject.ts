import { NextApiRequest } from 'next';

export type GenericObject<T = unknown> = Record<string, T>;

/**
 * Parse the request body if it's a string, or return the body as-it if it's not.
 *
 * Simplifies the handling of "body" from JSON RPC, by insuring a consistant way of dealing with the request body.
 * This way, it doesn't matter if data is sent using proper headers (Content-Type) or not.
 * Resolves issues with inconsistent responses from different RPC Providers
 * 
 *
 * @param req
 */
export const convertRequestBodyToJSObject = <T = unknown>(req: NextApiRequest): GenericObject<T> => {
  let parsedBody: GenericObject<T> = {};

  if (typeof req?.body === 'string' && req?.body?.length > 0) {
    parsedBody = JSON.parse(req?.body);
  } else {
    parsedBody = req.body;
  }

  return parsedBody;
};

export default convertRequestBodyToJSObject;
