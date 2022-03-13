import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ENVIRONMENTS } from '../constants/general.constants';
import { HEADERS, HEADER_HOSTS } from '../constants/header.constants';
import MissingHeaderException from '../exceptions/missingHeader.exception';

export const headerVerificationHandler =
    () =>
    (handler: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>): ((event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>) =>
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const host = event.headers ? (event.headers[HEADERS.ORIGIN] || event.headers[HEADERS.ORIGIN_CAPITALIZED]) : undefined;
        if (!host || (process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT && !(host in HEADER_HOSTS.DEVELOPMENT)) || (process.env.NODE_ENV !== ENVIRONMENTS.DEVELOPMENT && !(host in HEADER_HOSTS.PRODUCTION))) {
            console.log(event.headers);
            throw new MissingHeaderException(HEADERS.ORIGIN);
        } 

        return handler(event);
    };
