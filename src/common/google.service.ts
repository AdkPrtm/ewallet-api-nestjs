import { Injectable } from "@nestjs/common";
import { Auth } from "googleapis";
import * as path from 'path';


@Injectable()
export class GoogleService {
    private auth: Auth.GoogleAuth;
    constructor() {
        this.auth = new Auth.GoogleAuth({
            keyFile: path.join('service_account.json'),
            scopes: 'https://www.googleapis.com/auth/firebase.messaging',
        });
    }

    async getAccessToken() {
        const client = await this.auth.getAccessToken();
        return client;
    }
}