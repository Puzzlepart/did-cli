const { findBestMatch } = require("string-similarity")

const sortByBestMatch = (field, fields) => {
    return findBestMatch(field, fields).ratings.sort((a, b) => b.rating - a.rating).map(a => a.target)
}

module.exports = (fields) => {
    return [
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
        },
        {
            "type": "list",
            "name": "createdAt",
            "message": "Created property",
            "default": "createdAt"
        },
        {
            "type": "list",
            "name": "hours",
            "message": "Hours property",
            "default": "hours"
        }
    ].map(p => ({
        ...p,
        choices: sortByBestMatch(p.name, fields)
    }))
}