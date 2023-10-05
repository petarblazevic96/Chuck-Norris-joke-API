import * as nodemailer from "nodemailer";

import { OnQueueCompleted, OnQueueError, Process, Processor } from "@nestjs/bull";
import { SendJokeDto } from "./dto/joke.dto";
import { Job } from "bull";

@Processor("email")
export class JokeEmailConsumer {
    private readonly gmailPassword: string = "<password>";
    private readonly gmailEmail: string = "<email>";

    private transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: this.gmailEmail,
            pass: this.gmailPassword
        }
    });

    @Process("sendEmail")
    async sendEmail(job: Job<SendJokeDto>) {
        let messageId: string = "";
        let err: string = "";

        try {
            const mailOptions = {
                from: this.gmailEmail,
                to: job.data.email,
                subject: `Random Chuck Norris fact`,
                text: `Url: ${job.data.url}\nFact: ${job.data.value}`
            };

            const res = await this.transporter.sendMail(mailOptions);
            messageId = res.messageId;

            if (res.accepted.length > 0) {
                await job.isCompleted();
            } else {
                await job.isFailed();
            }
            job.progress(100);
        } catch (error) {
            err = error;
        } finally {
            await job.finished();

            return {
                id: job.id,
                messageId: messageId,
                error: err
            }
        }
    }

    @OnQueueError()
    async onQueueError() {}

    @OnQueueCompleted()
    async onQueueCompleted() {}
}