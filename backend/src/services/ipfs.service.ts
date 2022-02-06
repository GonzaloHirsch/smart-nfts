import pinataClient from '@pinata/sdk';
import { Readable } from 'stream';
import { IFilePinResponse, IJsonPinResponse } from '../interfaces/ipfs.interface';

const pinata = pinataClient(process.env.PINATA_API_KEY!, process.env.PINATA_API_SECRET!);

class IpfsService {
    private static instance: IpfsService;

    static getInstance = () => {
        if (!IpfsService.instance) {
            IpfsService.instance = new IpfsService();
        }
        return IpfsService.instance;
    };

    public async addFileToIPFS(contents: Buffer, name: string): Promise<IFilePinResponse> {
        /*eslint no-undef: ["error", { "typeof": true }] */
        const stream = Readable.from(contents);
        // Add path as per: https://github.com/PinataCloud/Pinata-SDK/issues/28#issuecomment-816439078
        // @ts-ignore
        stream.path = name;

        // Response format
        return await pinata
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

    public async addJSONToIPFS(contents: any, name: string): Promise<IJsonPinResponse> {
        return await pinata
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
}

export default IpfsService;
