const { findBestMatch } = require("string-similarity")

const sortByBestMatch = (field, fields) => {
    return findBestMatch(field, fields).ratings.sort((a, b) => b.rating - a.rating).map(a => a.target)
}

module.exports = (fields) => {
    return [
        {
            "type": "list",
            "name": "_id",
            "message": "ID property",
            "default": "id",
            "choices": fields
        },
        {
            "type": "list",
            "name": "customerKey",
            "message": "Customer key property",
            "default": "customerKey",
            "choices": fields
        },
        {
            "type": "list",
            "name": "key",
            "message": "Key property",
            "default": "key",
            "choices": fields
        },
        {
            "type": "list",
            "name": "name",
            "message": "Name property",
            "default": "name",
            "choices": fields
        },
        {
            "type": "list",
            "name": "description",
            "message": "Description property",
            "default": "description",
            "choices": fields
        },
        {
            "type": "list",
            "name": "webLink",
            "message": "Web link property",
            "default": "webLink",
            "choices": fields
        }
    ].map(p => ({
        ...p,
        choices: sortByBestMatch(p.name, fields)
    }))
}