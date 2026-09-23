import { OAuth2Client } from "google-auth-library";

export class OAuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async verify(provider: string, token: string) {
    if (provider === "google") {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      return ticket.getPayload();
    }
    throw new Error("Provider not implemented");
  }
}
