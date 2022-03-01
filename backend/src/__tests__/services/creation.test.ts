import { IArguments } from "../../interfaces/general.interface";
import { EXTENSIONS } from "../../constants/contract.constants";
import CreationService from "../../services/creation.service";
import InvalidInputException from "../../exceptions/invalidInput.exception";
import InvalidContractOptionsException from "../../exceptions/invalidContractOptionsException.exception";
import { LimitSupply } from "../../contracts/LimitSupply.contract";

let service: CreationService;
let valid: IArguments;

beforeAll(async () => {
    service = CreationService.getInstance();
    valid = {
        name: 'TestContract',
        symbol: 'TST'
    };
});

describe('Valid Contract Creation', () => {

    test('no extensions contract is generated', () => {
        const extensions: EXTENSIONS[] = [];
        const expectedContract = "// SPDX-License-Identifier: MIT\n// Contract created with Smart NFTs: https://smart-nfts.gonzalohirsch.com/\npragma solidity ^0.8.2;\n\nimport \"@openzeppelin/contracts/token/ERC721/ERC721.sol\";\n\ncontract TestContract is ERC721 \n{\n\t\n\tconstructor() ERC721(\"TestContract\", \"TST\") {}\n\t\n}";
        
        expect(service.genContract(valid.name, valid.symbol, extensions, {})).toBe(expectedContract);
    });

    test('multiple extensions contract is generated', () => {
        const extensions: EXTENSIONS[] = [EXTENSIONS.Mintable, EXTENSIONS.AutoIncrementIds, EXTENSIONS.ERC721Enumerable];
        const expectedContract = "// SPDX-License-Identifier: MIT\n// Contract created with Smart NFTs: https://smart-nfts.gonzalohirsch.com/\npragma solidity ^0.8.2;\n\nimport \"@openzeppelin/contracts/access/Ownable.sol\";\nimport \"@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol\";\nimport \"@openzeppelin/contracts/token/ERC721/ERC721.sol\";\nimport \"@openzeppelin/contracts/utils/Counters.sol\";\n\ncontract TestContract is ERC721, ERC721Enumerable, Ownable\n{\n\tusing Counters for Counters.Counter;\n\t\n\tCounters.Counter private _tokenIdCounter;\n\t\n\tconstructor() ERC721(\"TestContract\", \"TST\") {}\n\t\n\tfunction safeMint(address to)\n\t\tpublic\n\t\tonlyOwner\n\t{\n\t\tuint256 tokenId = _tokenIdCounter.current();\n\t\t_tokenIdCounter.increment();\n\t\t_safeMint(to, tokenId);\n\t}\n\t\n\t// The following functions are overrides required by Solidity.\n\t\n\tfunction _beforeTokenTransfer(address from, address to, uint256 tokenId)\n\t\tinternal\n\t\toverride(ERC721, ERC721Enumerable)\n\t{\n\t\tsuper._beforeTokenTransfer(from, to, tokenId);\n\t}\n\t\n\tfunction supportsInterface(bytes4 interfaceId)\n\t\tpublic\n\t\tview\n\t\toverride(ERC721, ERC721Enumerable)\n\t\treturns (bool)\n\t{\n\t\treturn super.supportsInterface(interfaceId);\n\t}\n}";
        
        expect(service.genContract(valid.name, valid.symbol, extensions, {})).toBe(expectedContract);
    });

    test('user input contract is generated', () => {
        const extensions: EXTENSIONS[] = [EXTENSIONS.ERC721Enumerable, EXTENSIONS.LimitSupply];
        const expectedContract = "// SPDX-License-Identifier: MIT\n// Contract created with Smart NFTs: https://smart-nfts.gonzalohirsch.com/\npragma solidity ^0.8.2;\n\nimport \"@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol\";\nimport \"@openzeppelin/contracts/token/ERC721/ERC721.sol\";\n\ncontract TestContract is ERC721, ERC721Enumerable\n{\n\t\n\tuint256 private _maxSupply;\n\t\n\tconstructor() ERC721(\"TestContract\", \"TST\") {\n\t\t_maxSupply = 5;\n\t}\n\t\n\t// The following functions are overrides required by Solidity.\n\t\n\tfunction _beforeTokenTransfer(address from, address to, uint256 tokenId)\n\t\tinternal\n\t\toverride(ERC721, ERC721Enumerable)\n\t{\n\t\tsuper._beforeTokenTransfer(from, to, tokenId);\n\t}\n\t\n\tfunction supportsInterface(bytes4 interfaceId)\n\t\tpublic\n\t\tview\n\t\toverride(ERC721, ERC721Enumerable)\n\t\treturns (bool)\n\t{\n\t\treturn super.supportsInterface(interfaceId);\n\t}\n}";
        
        expect(service.genContract(valid.name, valid.symbol, extensions, {maxSupply: 5})).toBe(expectedContract);
    });
});

describe('Invalid Contract Creation', () => {

    const nameCases = [['spaces', 'Test Contract'], ['empty', ''], ['invalid character', 'Test$'], ['length exceeded', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa']];

    test.each(nameCases)(
        "invalid name type - %s",
        (_methodName, invalidName) => {
            
            const extensions: EXTENSIONS[] = [EXTENSIONS.Mintable, EXTENSIONS.AutoIncrementIds, EXTENSIONS.ERC721Enumerable];

            expect(
                () => {service.genContract(invalidName, valid.symbol, extensions, {})}
            ).toThrow(InvalidInputException.Type('name', 'string', invalidName));
        }
    );

    const symbolCases = [['spaces', 'TS T'], ['empty', ''], ['invalid character', 'TST$'], ['length exceeded', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa']];

    test.each(symbolCases)(
        "invalid symbol type - %s",
        (_methodName, invalidSymbol) => {
            
            const extensions: EXTENSIONS[] = [EXTENSIONS.Mintable, EXTENSIONS.AutoIncrementIds, EXTENSIONS.ERC721Enumerable];
            
            expect(
                () => {service.genContract(valid.name, invalidSymbol, extensions, {})}
            ).toThrow(InvalidInputException.Type('symbol', 'string', invalidSymbol));
        }
    );

    const extensionCases = [['storage', [EXTENSIONS.UniqueStorage]], ['enumerable', [EXTENSIONS.LimitSupply]]];

    test.each(extensionCases)(
        "missing parent extension - %s",
        (_methodName, extensionList) => {
                        
            expect(
                () => {service.genContract(valid.name, valid.symbol, extensionList as EXTENSIONS[], {})}
            ).toThrow(InvalidContractOptionsException);
        }
    );

    test('missing user input - limit supply', () => {
        
        const extensions: EXTENSIONS[] = [EXTENSIONS.ERC721Enumerable, EXTENSIONS.LimitSupply];
        const missingInput = {};
        const neededInput = LimitSupply.getExtensionInputs()[0];

        expect(
            () => {service.genContract(valid.name, valid.symbol, extensions as EXTENSIONS[], missingInput)}
        ).toThrow(InvalidInputException.Missing(neededInput.name, neededInput.type));
    });

    test('invalid user input type - limit supply', () => {
        
        const extensions: EXTENSIONS[] = [EXTENSIONS.ERC721Enumerable, EXTENSIONS.LimitSupply];
        const invalidInput = {maxSupply: 'hi'};
        const neededInput = LimitSupply.getExtensionInputs()[0];

        expect(
            () => {service.genContract(valid.name, valid.symbol, extensions as EXTENSIONS[], invalidInput)}
        ).toThrow(InvalidInputException.Type(neededInput.name, neededInput.type, invalidInput.maxSupply));
    });

});