const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");


const createSendEmailCommand = (toAddress, fromAddress,subject,body) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
      ],
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        //   Data: "<h1>This is the email body</h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is the text format email",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};


const run = async (subject,body) => {
  const sendEmailCommand = createSendEmailCommand(
    "deepanker488@gmail.com",
    "deepanker@devtinder-project.site",
    subject,
    body
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports= {run};