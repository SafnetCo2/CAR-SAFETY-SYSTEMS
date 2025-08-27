import jwt from "jsonwebtoken";
const middleware = (req, res, next) => {
    try{
        const token = req.header("Authorization")?.replace("Bearer ", "").trim();
        if(!token) {
            return res.status(401).json({ message: "No token, authorization denied ", });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err) {
        res.status(401).json({ message: "invalid or expired token" });

    }
}
export default middleware;