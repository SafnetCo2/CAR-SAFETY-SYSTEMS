export const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            email: user.email,
            name:user.name,
            shortId: user.shortId   // optional
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );
};
