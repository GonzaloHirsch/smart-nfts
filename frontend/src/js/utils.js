export const getParameterPlaceholder = (type) => {
    switch (type) {
        case 'address':
            return 'inputs.placeholder.address'
        case 'uint256':
            return 'inputs.placeholder.uint256'
        case 'bytes4':
            return 'inputs.placeholder.bytes4'
        case 'bytes':
            return 'inputs.placeholder.bytes'
        case 'bool':
            return 'inputs.placeholder.bool'
    }
    return '';
}