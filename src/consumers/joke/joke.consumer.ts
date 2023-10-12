import * as nodemailer from "nodemailer";

import { OnQueueCompleted, OnQueueError, OnQueueFailed, OnQueueStalled, Process, Processor } from "@nestjs/bull";
import { SendJokeDto } from "../../joke/dto/joke.dto";
import { Job } from "bull";
import { SendJokeQueueResult } from "../../joke/dto/send-joke-queue-result.dto";
import { JokeConsumerService } from "./joke-consumer.service";
import { ConfigService } from "@nestjs/config";
import { EmailOptionsConfiguration } from "../../config/interfaces";
import { CustomLogger } from "../../logger/logger.service";


@Processor("email")
export class JokeEmailConsumer {
    private emailCredentials: EmailOptionsConfiguration | undefined;
    private transporter;

    constructor(
        private jokeConsumerService: JokeConsumerService,
        private configService: ConfigService,
        private loggerService: CustomLogger
    ) {
        this.emailCredentials = this.configService.get<EmailOptionsConfiguration>("email_options");
        
        if (!this.emailCredentials?.email || !this.emailCredentials?.password) {
            throw new Error("Email or password are not set!");
        }

        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.emailCredentials?.email,
                pass: this.emailCredentials?.password
            }
        });
    }

    @Process("sendEmail")
    async sendEmail(job: Job<SendJokeDto>): Promise<SendJokeQueueResult> {
        let messageId: string = "";
        let err: any;

        try {
            const mailOptions = {
                from: this.emailCredentials?.email,
                to: job.data.email,
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

    @OnQueueError()
    onQueueError(err: Error) {
        this.loggerService.error("Error while executing queue", err.message);
    }

    @OnQueueStalled()
    onQueueStalled(job: Job<SendJokeDto>) {
        this.loggerService.error("Queue stalled", job.id);
    }

    @OnQueueFailed()
    onQueueFailed(job: Job<SendJokeDto>, err: Error) {
        this.loggerService.error("Queue failed", {
            job_id: job.id,
            message: err.message
        });
    }
}