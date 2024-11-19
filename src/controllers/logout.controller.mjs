export const logout = async (req, res) => {
    console.log("logout controller")
    const authToken = req.cookies["Auth"] || req.header['Authorization'];
    if(!authToken){
        return res.status(400).json({"error": "Bad request, user is not logged in"})
    }
    res.cookie('Auth', "", { httpOnly: true, secure: true, maxAge: 1 });
    return res.status(200).json({"message": "Done"})
}