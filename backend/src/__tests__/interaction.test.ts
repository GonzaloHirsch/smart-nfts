import InteractionService from "../services/interaction.service";
import InvalidInputException from "../exceptions/invalidInput.exception";
import { IAbiInput } from "../interfaces/abi.interface";
import { CONTRACT_TYPES, SUPPORTED_NETWORKS } from "../constants/contract.constants";

let abiInputDef: IAbiInput[];
let service: InteractionService;
let invalidInput: any;
let validInput: any;
const addressEx = '0x6AaFbDAC71C704Fe8A7e3EFC1Da26682Bc5cFEd2';

beforeAll(async () => {
    service = InteractionService.getInstance(SUPPORTED_NETWORKS.RINKEBY);
    const correctInputs:  IAbiInput[] = [{
        name: "from",
        type: "address",
        internalType: CONTRACT_TYPES.ADDRESS
    }, {
        name: "to",
        type: "address",
        internalType: CONTRACT_TYPES.ADDRESS,
    }];
    const inputToTest: IAbiInput = {
        name: "tokenId",
        type: "uint256",
        internalType: CONTRACT_TYPES.UINT256
    }
    abiInputDef = [
        ...correctInputs, 
        inputToTest
    ]

    invalidInput = {
        missing: {
            from: addressEx,
            to: addressEx,
            tokenIds: 4
        },
        type: {
            from: addressEx,
            to: addressEx,
            tokenId: 'string'
        },
        count: {
            from: addressEx,
            to: addressEx,
        },
    }

    // Valid but in different order
    validInput = {
        tokenId: 5,
        from: addressEx,
        to: addressEx
    }
});

describe('Check validity of arguments', () => {

    test('missing inputs', () => {
        const args = invalidInput.missing;
        expect(
            () => {service._checkAndOrderValidInputs(abiInputDef, args)}
        ).toThrow(InvalidInputException.Missing('tokenId', 'uint256'));
    });

    test('incorrect input amount', () => {
        const args = invalidInput.count;
        expect(
            () => {service._checkAndOrderValidInputs(abiInputDef, args)}
        ).toThrow(InvalidInputException.Count(3, 2));
    });

    test('incorrect input type', () => {
        const args = invalidInput.type;
        expect(
            () => {service._checkAndOrderValidInputs(abiInputDef, args)}
        ).toThrow(InvalidInputException.Type('tokenId', 'uint256', args.tokenId));
    });

    test('return valid inputs in correct order', () => {
        const args = validInput;
        expect(service._checkAndOrderValidInputs(abiInputDef, args)).toStrictEqual({
            from: addressEx,
            to: addressEx,
            tokenId: 5,
        });
    });
})