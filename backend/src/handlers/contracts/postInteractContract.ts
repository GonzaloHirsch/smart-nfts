import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import IpfsService from '../../services/ipfs.service';
import { errorHandler } from '../../middleware/errorHandler.middleware';
import { corsHandler } from '../../middleware/corsHandler.middleware';
import { isEmptyPathParams, validContractId, isEmptyBody } from '../../helpers/validations.helper';
import GenericException from '../../exceptions/generic.exception';
import { setHttpErrorMsg } from '../../helpers/errors.helper';
import { HTTP_ERRORS } from '../../constants/errors.constants';
import { parse } from 'aws-multipart-parser'
import StoredContractService from '../../services/storedContract.service';

const endpoint = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    
    if (isEmptyPathParams(event.pathParameters) || !validContractId(event.pathParameters!.contractId)) 
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Missing contract ID'));
    // else 
    const formData = parse(event, true);
    
    // Parse the inputs and check if its a valid JSON
    let args: IArguments;
    try {
        args = JSON.parse(formData.inputs) as IArguments;
    } catch (err) {
        throw new GenericException(setHttpErrorMsg(HTTP_ERRORS.BAD_REQUEST.PARAMS, 'Invalid JSON input'));
    }

    // @ts-ignore
    await IpfsService.getInstance().addFileToIPFS(formData.token.content, formData.token.filename);
    // @ts-ignore
    console.log(await IpfsService.getInstance().addJSONToIPFS({test: "a", test2: "b"}, formData.token.filename));
    // console.log(formData.token.content);
    
    const instance = await StoredContractService.getInstance();

    const contract = await instance.getEnforcedContractById(event.pathParameters!.contractId!)

    

    return {
        statusCode: 201,
        body: JSON.stringify({})
    };
};

export const handler = corsHandler('POST')(errorHandler()(endpoint));
