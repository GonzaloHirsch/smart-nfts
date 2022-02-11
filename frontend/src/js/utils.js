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
        case 'string':
            return 'inputs.placeholder.string'
        case 'boost_number':
            return 'inputs.placeholder.boost_number'
        case 'boost_percentage':
            return 'inputs.placeholder.boost_percentage'
        case 'number':
            return 'inputs.placeholder.number'
        case 'long string':
            return 'inputs.placeholder.long_string'
    }
    return '';
}