import * as nodemailer from "nodemailer";

import { OnQueueCompleted, Process, Processor } from "@nestjs/bull";
import { SendJokeDto } from "../../joke/dto/joke.dto";
import { Job } from "bull";
import { SendJokeQueueResult } from "../../joke/dto/send-joke-queue-result.dto";
import { JokeConsumerService } from "./joke-consumer.service";

@Processor("email")
export class JokeEmailConsumer {
    constructor(private jokeConsumerService: JokeConsumerService) {}
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
    async sendEmail(job: Job<SendJokeDto>): Promise<SendJokeQueueResult> {
        let messageId: string = "";
        let err: any;
        
        try {
            const mailOptions = {
                from: this.gmailEmail,
                to: this.gmailEmail,
                subject: `Random Chuck Norris fact`,
                text: `Url: ${job.data.url}\nFact: ${job.data.value}`
            };
            const res = await this.transporter.sendMail(mailOptions);
            messageId = res.messageId;
        } catch (error) {
            err = error;
        } finally {
            const returnValue = {
                messageId: messageId,
                err: err
            };

            return returnValue;
        }
    }

    @OnQueueCompleted()
    async onQueueCompleted(job: Job<SendJokeDto>, result: SendJokeQueueResult) {
        await this.jokeConsumerService.saveJob({
            jobId: job.id.toString(),
            email: job.data.email,
            value: job.data.value,
            url: job.data.url,
            messageId: result.messageId,
            err: result.err?.message
        });
    }
}