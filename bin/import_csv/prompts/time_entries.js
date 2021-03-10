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
            "default": "id"
        },
        {
            "type": "list",
            "name": "projectId",
            "message": "Project id/tag property",
            "default": "projectId"
        },
        {
            "type": "list",
            "name": "title",
            "message": "Title property",
            "default": "title"
        },
        {
            "type": "list",
            "name": "body",
            "message": "Body property",
            "default": "body"
        },
        {
            "type": "list",
            "name": "duration",
            "message": "Duration property",
            "default": "duration"
        },
        {
            "type": "list",
            "name": "startDate",
            "message": "Start date property",
            "default": "startDate"
        },
        {
            "type": "list",
            "name": "endDate",
            "message": "End date property",
            "default": "endDate"
        },
        {
            "type": "list",
            "name": "periodId",
            "message": "Period ID property",
            "default": "periodId"
        },
        {
            "type": "list",
            "name": "userId",
            "message": "User ID property",
            "default": "userId"
        }
    ].map(p => ({
        ...p,
        choices: sortByBestMatch(p.name, fields)
    }))
}