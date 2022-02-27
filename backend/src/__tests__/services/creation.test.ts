import { IArguments } from "../../interfaces/general.interface";
import { EXTENSIONS } from "../../constants/contract.constants";
import CreationService from "../../services/creation.service";

let service: CreationService;
let valid: IArguments;

beforeAll(async () => {
    service = CreationService.getInstance();
    valid = {
        name: 'TestContract',
        symbol: 'TST'
    };
});

describe('Full Valid Contract Creation', () => {

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