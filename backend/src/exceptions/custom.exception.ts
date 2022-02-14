
class CustomException extends Error {
    public data: any;
    constructor(msg: string, data?: any) {
        super(msg);
        this.data = data;
    }
}

export default CustomException;