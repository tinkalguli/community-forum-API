module.exports = {
    verifyUserAccess : async (ownerId, currentUserId, res) => {
        if (ownerId !== currentUserId) {
            res.status(401).json({ errors : { body : [ "You are not authorized" ]}});
       }
    }
}