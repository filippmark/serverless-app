const schema = {
    properties: {
        queryStringParameters: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    enum: ['CLOSED', 'OPEN']
                }
            }
        }
    },
    required: [],
}

export default schema;