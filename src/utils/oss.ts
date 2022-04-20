import { ossService } from '@/api';
import OSS from 'ali-oss';

let client: OSS;
/**
 * 获取oss客户端
 * @returns
 */
export function getOssClient(): Promise<OSS> {
	return new Promise((resolve, reject) => {
		if (client) {
			resolve(client);
			return;
		}
		ossService
			.getSTS()
			.then((res) => {
				client = new OSS({
					region: 'oss-cn-shenzhen',
					bucket: 'omazio-test',
					accessKeyId: res.data.Credentials.AccessKeyId,
					accessKeySecret: res.data.Credentials.AccessKeySecret,
					stsToken: res.data.Credentials.SecurityToken,
					refreshSTSToken: async () => {
						const refreshTokenReq = await ossService.getSTS();
						const { AccessKeyId, AccessKeySecret, SecurityToken } =
							refreshTokenReq.data.Credentials;
						return {
							accessKeyId: AccessKeyId,
							accessKeySecret: AccessKeySecret,
							stsToken: SecurityToken,
						};
					},
				});
				resolve(client);
			})
			.catch((err) => {
				reject(err);
			});
	});
}
