const cron = require('node-cron');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const ConnectionRequestModel = require('../models/connectionRequest');
const sendEmail = require("../utils/sendEmail")

cron.schedule("33 0 * * *", async () => {
    //Send emails to all people who got requests the previous day

    try {

        // const yesterday = subDays(new Date(), 0);        //on same day
        const yesterday = subDays(new Date(), 1);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate("fromUserId toUserId");


        // console.log(pendingRequests[0]);

        // Fetching email to send data
        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))] //converting it into array
        console.log(listOfEmails);

        for (const email of listOfEmails) {
            //Send Emails
            try {
                const res = await sendEmail.run(
                    "New Friend Request Pending for " + email, "There are so many friend requests pending,please login to DevTinder to accept or reject the requests")
                console.log(res);

            } catch (err) {
                console.log(err);
            }
        }
    } catch (err) {
        console.log(err);
    }
}); 