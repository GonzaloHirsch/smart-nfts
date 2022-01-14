export interface IStoredContract {
  dateCreated: Date;
  dateUpdated: Date;
  abi: Array<{
    type: String;
    name: String;
    stateMutability: String;
    inputs: Array<{
      name: String;
      type: String;
      components: Array<{
        name: String;
        type: String;
      }>;
    }>;
    outputs: Array<{
      name: String;
      type: String;
      components: Array<{
        name: String;
        type: String;
      }>;
    }>;
  }>;
  deployedAddress: string;
}
