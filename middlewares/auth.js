module.exports = {
    verifyUserAccess : (ownerId, currentUserId, res) => {
        if (ownerId.toString() !== currentUserId.toString()) {
            res.status(401).json({ errors : { body : [ "You are not authorized" ]}});
        }
    }
}