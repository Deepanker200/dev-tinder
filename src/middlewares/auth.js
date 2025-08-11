const adminAuth = (req, res, next) => {
    console.log("Admin auth");

    const token = "xyz";
    const isAuthorized = token == "xyz";
    if (!isAuthorized) {
        res.status(401).send("Unauthorized request")
    }
    else {
        next();     // move to next route handler- It schedules
    }
}

const userAuth = (req, res, next) => {
    console.log("User auth");

    const token = "xyzs";
    const isAuthorized = token == "xyz";
    if (!isAuthorized) {
        res.status(401).send("Unauthorized request")
    }
    else {
        next();
    }
}

module.exports={
    adminAuth,
    userAuth
}