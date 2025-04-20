import User from "../models/UserModel.js";

export const searchContacts = async (request, response, next) => {
    try {
        const { searchTerm } = request.body;
        if (searchTerm === null || searchTerm === undefined) {
            return response.status(400).send("searchTerm is required");
        }
        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^{}()|[\]\\]/g, "\\$&"); //sanitizes the searchTerm to prevent potential issues with regular expressions
        const regex = new RegExp(sanitizedSearchTerm, "i"); 
        //RegExp: This is a built-in JavaScript constructor (a special function used to create objects) that creates regular expression objects.

        //"i": This flag makes the regular expression case-insensitive
        const contacts = await User.find({
            $and: [{ _id: { $ne: request.userId } }, {
                $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
            }
            ]
        })
        //$and: [...]: This is a MongoDB logical operator that requires all conditions within the array to be true for a document to be selected.
        //{ _id: { $ne: request.userId } }: This condition ensures that the user making the request (identified by request.userId) is excluded from the search results
        //$ne is a MongoDB comparison operator meaning "not equal to". It's common to exclude the current user when searching for contacts.
        //{ $or: [...] }: This is another MongoDB logical operator that requires at least one condition within the array to be true for a document to be selected.
        //firstname lastname and email if matchs will be provided
        return response.status(200).json({ contacts });

        // At this point, the 'contacts' variable holds the array of users
        // that match the search criteria (excluding the current user).
        // However, the function doesn't explicitly send this response.
        // It's likely that there's missing code here to send the 'contacts'
        // back to the client.

    } catch (error) {
        console.log(error);
        return response.status(500).send("issue is here");
    }
}