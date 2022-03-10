import MintingService from "../services/minting.service";
import { METADATA_DISPLAY_TYPES, METADATA_TYPES } from "../constants/metadata.constants";
import { IMetadata } from "../interfaces/metadata.interface";
import InvalidInputException from "../exceptions/invalidInput.exception";

let metadataDef: IMetadata;
let service: MintingService;
let validAttributes: any;

beforeAll(async () => {
    service = MintingService.getInstance();
    metadataDef = {
        hasImage: true,
        attributes: [
            {
                traitType: "Generation",
                displayType: METADATA_DISPLAY_TYPES.PLAIN_NUMBER ,
                traitFormat: METADATA_TYPES.NUMBER
            },
            {
                traitType: "Agresiveness",
                displayType: METADATA_DISPLAY_TYPES.BOOST_PERCENTAGE,
                traitFormat: METADATA_TYPES.NUMBER
            },
            {
                traitType: "Species",
                traitFormat: METADATA_TYPES.STRING,
            }
        ]
    }
    validAttributes = {
        Generation: 348,
        Agresiveness: 52,
        Species: 'string',
    }
});

describe('Check validity of metadata arguments', () => {

    test('missing default arguments - name', () => {
        const args = {description: 'Description', attributes: validAttributes}
        expect(
            () => {service._checkAndMapToStandardMetadata(metadataDef, args, true)}
        ).toThrow(InvalidInputException.Missing('name', 'string'));
    });

    test('missing default arguments - description', () => {
        const args = {name: 'Name', attributes: validAttributes}
        expect(
            () => {service._checkAndMapToStandardMetadata(metadataDef, args, true)}
        ).toThrow(InvalidInputException.Missing('description', 'string'));
    });

    test('invalid symbol type - name', () => {
        const args = {name: 52, description: 'Description', attributes: validAttributes}
        expect(
            () => {service._checkAndMapToStandardMetadata(metadataDef, args, true)}
        ).toThrow(InvalidInputException.Type('name', 'string', args.name));
    });

    test('invalid symbol type - description', () => {
        const args = {name: 'Name', description: 52, attributes: validAttributes}
        expect(
            () => {service._checkAndMapToStandardMetadata(metadataDef, args, true)}
        ).toThrow(InvalidInputException.Type('description', 'string', args.description));
    });

});