'use strict';

var request = require("request");

// populate environment variables locally.
require('dotenv').config()


exports.handler = async function (event, context) {

  // get the arguments from the notification
  var body = JSON.parse(event.body);
  var msg;

  console.log("saba", body);

  // prepare call to the Slack API
  var slackURL = process.env.SLACK_WEBHOOK_COMMENT_URL;
  var slackPayload = {
    "text": "New comment on hawksworx.com",
    "attachments": [
      {
        "fallback": "New comment on hawksworx.com",
        "color": "#444",
        "author_name": body.data.email,
        "title": body.data.path,
        "title_link": process.env.URL + body.data.path,
        "text": body.data.comment
      },
      {
        "fallback": "Manage comments on https://www.hawksworx.com",
        "callback_id": "comment-action",
        "actions": [
          {
            "type": "button",
            "text": "Approve comment",
            "name": "approve",
            "value": body.id
          },
          {
            "type": "button",
            "style": "danger",
            "text": "Delete comment",
            "name": "delete",
            "value": body.id
          }
        ]
      }]
  };
  console.log("saba", slackPayload);

  // post the notification to Slack
  request.post({ url: slackURL, json: slackPayload }, function (err, httpResponse, body) {
    if (err) {
      msg = 'Post to Slack failed:' + err;
    } else {
      msg = 'Post to Slack successful!  Server responded with:' + body;
    }
  });
  return {
    statusCode: 200,
    body: msg
  };

}
