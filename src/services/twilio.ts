import Twilio from "twilio";

class TwilioService {
  private static instance: TwilioService;
  private static client: Twilio.Twilio;

  private constructor() {}

  static getInstance() {
    if (!TwilioService.instance) {
      TwilioService.instance = new TwilioService();
      TwilioService.client = Twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
    }
    return TwilioService.instance;
  }

  public async sendPhoneCode(phone: string) {
    const response = await TwilioService.client.verify
      .services(process.env.TWILIO_SERVICE_SID!)
      .verifications.create({ to: phone, channel: "sms" });

    return response.status;
  }
  public async verifyPhoneCode(phone: string, code: string) {
    const response = await TwilioService.client.verify
      .services(process.env.TWILIO_SERVICE_SID!)
      .verificationChecks.create({ to: phone, code: code });

    return response.status;
  }
}

export default TwilioService.getInstance();
