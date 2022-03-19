import { SESv2Client, SESv2ClientConfig } from '@aws-sdk/client-sesv2';
import { singleton } from 'tsyringe';

export const validRegions = [
	'us-east-2',
	'us-east-1',
	'us-west-1',
	'us-west-2',
	'af-south-1',
	'ap-east-1',
	'ap-southeast-3',
	'ap-south-1',
	'ap-northeast-3',
	'ap-northeast-2',
	'ap-southeast-1',
	'ap-southeast-2',
	'ap-northeast-1',
	'ca-central-1',
	'eu-central-1',
	'eu-west-1',
	'eu-west-2',
	'eu-south-1',
	'eu-west-3',
	'eu-north-1',
	'me-south-1',
	'sa-east-1',
];

export interface IAwsMailerProvider {
	init(region?: SESv2ClientConfig): SESv2Client;
}

@singleton()
export class AwsMailerProvider implements IAwsMailerProvider {
	protected client: SESv2Client | null = null;

	public init(config?: SESv2ClientConfig): SESv2Client {
		if (!this.client) {
			this.client = new SESv2Client({ ...config });
		}

		return this.client;
	}
}

export default AwsMailerProvider;
