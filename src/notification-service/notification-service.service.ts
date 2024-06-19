import { Injectable } from '@nestjs/common';
import { GoogleService } from 'src/common/google.service';

@Injectable()
export class NotificationService {
  constructor(private readonly googleAuthProvider: GoogleService) {}

  async sendNotification(title: string, body: string, tokenDevice: string) {
    const client = await this.googleAuthProvider.getAccessToken();

    const result = await fetch(process.env.LINK_PROJECT_FIREBASE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${client}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          token: tokenDevice,
          notification: { body, title },
        },
      }),
    });
    const response = await result.json();
    return response;
  }
}
