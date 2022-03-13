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

describe('Check validity of metadata default arguments', () => {

    test('missing default arguments', () => {
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

    test('invalid default arguments type - name', () => {
        const args = {name: 52, description: 'Description', attributes: validAttributes}
        expect(
            () => {service._checkAndMapToStandardMetadata(metadataDef, args, true)}
        ).toThrow(InvalidInputException.Type('name', 'string', args.name));
    });

    test('invalid default arguments type - description', () => {
        const args = {name: 'Name', description: 52, attributes: validAttributes}
        expect(
            () => {service._checkAndMapToStandardMetadata(metadataDef, args, true)}
        ).toThrow(InvalidInputException.Type('description', 'string', args.description));
    });

});

describe('Check validity of metadata attribute arguments', () => {

    test('incorrect number of attributes', () => {
        const args = {name: 'Name', description: 'Description', attributes: Object.assign({}, validAttributes)}
        delete args.attributes.Generation;
        expect(
            () => {service._checkAndMapToStandardMetadata(metadataDef, args, true)}
        ).toThrow(InvalidInputException.Count(metadataDef.attributes.length, Object.keys(args.attributes).length));
    });

    test('invalid attribute argument', () => {
        const args = {name: 'Name', description: 'Description', attributes: Object.assign({}, validAttributes)}
        args.attributes.Agresiveness = 125;
        expect(
            () => {service._checkAndMapToStandardMetadata(metadataDef, args, true)}
        ).toThrow(InvalidInputException.Type('Agresiveness', METADATA_DISPLAY_TYPES.BOOST_PERCENTAGE, args.attributes.Agresiveness));
    });

    test('mispelled attribute name', () => {
        const args = {name: 'Name', description: 'Description', attributes: Object.assign({}, validAttributes)}
        delete args.attributes.Species;
        args.attributes.Spacies = 'Incorrect';
        expect(
            () => {service._checkAndMapToStandardMetadata(metadataDef, args, true)}
        ).toThrow(InvalidInputException.Missing('Species', METADATA_TYPES.STRING));
    });

    test('incorrect attribute type - string', () => {
        const args = {name: 'Name', description: 'Description', attributes: Object.assign({}, validAttributes)}
        args.attributes.Species = 50;
        expect(
            () => {service._checkAndMapToStandardMetadata(metadataDef, args, true)}
        ).toThrow(InvalidInputException.Type('Species', METADATA_TYPES.STRING, args.attributes.Species));
    });

    test('incorrect attribute type - number', () => {
        const args = {name: 'Name', description: 'Description', attributes: Object.assign({}, validAttributes)}
        args.attributes.Generation = 'string';
        expect(
            () => {service._checkAndMapToStandardMetadata(metadataDef, args, true)}
        ).toThrow(InvalidInputException.Type('Generation', METADATA_DISPLAY_TYPES.PLAIN_NUMBER, args.attributes.Generation));
    });

    test('incorrect attribute type - hasImage', () => {
        const args = {name: 'Name', description: 'Description', attributes: Object.assign({}, validAttributes)}
        expect(
            () => {service._checkAndMapToStandardMetadata(metadataDef, args, false)}
        ).toThrow(InvalidInputException.Type('hasImage', metadataDef.hasImage.toString(), false));
    });

});

describe('Valid metadata generation', () => {

    test('metadata is correctly generated', () => {
        const args = {name: 'Name', description: 'Description', attributes: Object.assign({}, validAttributes)}
        const result = service._checkAndMapToStandardMetadata(metadataDef, args, true);
        expect(result).toStrictEqual({
            name: args.name,
            description: args.description,
            attributes: [
                {
                    trait_type: 'Generation',
                    display_type: METADATA_DISPLAY_TYPES.PLAIN_NUMBER,
                    value: 348
                },
                {
                    trait_type: 'Agresiveness',
                    display_type: METADATA_DISPLAY_TYPES.BOOST_PERCENTAGE,
                    value: 52
                },
                {
                    trait_type: 'Species',
                    value: 'string'
                }
            ]
        });
    });

});