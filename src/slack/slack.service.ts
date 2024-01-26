import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);

  constructor() {}

  async sendDirectMessage(slackId: string, message: string): Promise<void> {
    if (slackId.length === 0 || slackId === undefined || slackId === null) {
      this.logger.warn('Slack ID is not defined or empty.');
      return;
    }

    const slackToken = process.env.SLACK_BOT_USER_OAUTH_ACCESS_TOKEN;
    const postMessageUrl = 'https://slack.com/api/chat.postMessage';

    try {
      await axios.post(
        postMessageUrl,
        {
          channel: slackId,
          text: message,
        },
        {
          headers: {
            Authorization: `Bearer ${slackToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
