import pinataClient from '@pinata/sdk';
import { IArguments } from '../interfaces/general.interface';
import { Readable } from 'stream';
import { IFilePinResponse, IJsonPinResponse } from '../interfaces/ipfs.interface';

const ipfs = pinataClient(process.env.PINATA_API_KEY!, process.env.PINATA_API_SECRET!);

class IpfsService {
    private static instance: IpfsService;

    static getInstance = () => {
        if (!IpfsService.instance) {
            IpfsService.instance = new IpfsService();
        }
        return IpfsService.instance;
    };



    public addFileToIPFS = async (contents: Buffer, name: string): Promise<IFilePinResponse> => {
        /*eslint no-undef: ["error", { "typeof": true }] */
        const stream = Readable.from(contents);
        // Add path as per: https://github.com/PinataCloud/Pinata-SDK/issues/28#issuecomment-816439078
        // @ts-ignore
        stream.path = name;

        // Response format
        return await ipfs
            .pinFileToIPFS(stream, {
                pinataMetadata: {
                    name: name
                },
                pinataOptions: {
                    cidVersion: 0
                }
            })
            .then((res) => {
                return {
                    ipfsHash: res.IpfsHash,
                    ipfsUri: `ipfs://${res.IpfsHash}`
                };
            });
    }

    public addJSONToIPFS = async (contents: any, name: string): Promise<IJsonPinResponse> => {
        return await ipfs
            .pinJSONToIPFS(contents, {
                pinataMetadata: {
                    name: name
                },
                pinataOptions: {
                    cidVersion: 0
                }
            })
            .then((res) => {
                return {
                    ipfsHash: res.IpfsHash,
                    ipfsUri: `ipfs://${res.IpfsHash}`
                };
            });
    }

    public addMetadataWithFileToIPFS = async (content: IArguments, file: any, name: string): Promise<IJsonPinResponse> => {
        
        // Pin file to metadata and get its hash and uri
        const pinnedFile = await IpfsService.getInstance().addFileToIPFS(file, name);
        
        // Add the file uri to the metadata
        content.image = pinnedFile.ipfsUri;

        // Pin the metadata json to IPFS
        return await IpfsService.getInstance().addJSONToIPFS(content, name)
    }
}

export default IpfsService;
