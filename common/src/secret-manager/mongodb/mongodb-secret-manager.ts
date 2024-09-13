import { SecretManagerBase } from '../secret-manager-base.js';
import { DataBaseHelper } from '../../helpers/db-helper.js';
import { Secret } from '../../entity/secret.js';
import Encryptor from './encryptor.js';

export class MongoDbSecretManager implements SecretManagerBase {

    // Bypass DB for secrets that are stored in environment variables
    // as these are accessed during the environment verification
    private static secretsFromEnvironment: Record<string, any> = {
        "secretkey/auth": {
            "ACCESS_TOKEN_SECRET": process.env.ACCESS_TOKEN_SECRET,
        },
        "keys/operator": {
            "OPERATOR_ID": process.env.OPERATOR_ID,
            "OPERATOR_KEY": process.env.OPERATOR_KEY
        },
        "apikey/ipfs": {
            "IPFS_STORAGE_API_KEY": process.env.IPFS_STORAGE_API_KEY
        }
    }
    
    public async getSecrets(path: string, _?: any): Promise<any> {
        if (MongoDbSecretManager.secretsFromEnvironment.hasOwnProperty(path)) {
            return MongoDbSecretManager.secretsFromEnvironment[path];
        }
        const helper = new DataBaseHelper(Secret);
        const secrets = await helper.findOne({ path });
        if (!secrets) {
            return null;
        }
        return JSON.parse(new Encryptor().decrypt(secrets.data));
    }

    public async setSecrets(path: string, data: any, _?: any): Promise<void> {
        if (MongoDbSecretManager.secretsFromEnvironment.hasOwnProperty(path)) {
            return;
        }
        console.log(`MONGODB-SECRETS: Setting secret ${path}`);
        const secret = await this.getSecrets(path);
        const helper = new DataBaseHelper(Secret);
        const secretData = new Encryptor().encrypt(JSON.stringify(data));
        if (secret) {
            console.log(`MONGODB-SECRETS: Existing secret ${path}`);
            secret.data = secretData;
            await helper.update({ path }, secret);
        } else {
            console.log(`MONGODB-SECRETS: New secret ${path}`);
            const row = helper.create({ path, data: secretData });
            await helper.create({ path, data: secretData });
            await helper.save(row)
        }
        console.log(`MONGODB-SECRETS: Completed setting secret ${path}`);

        {
            // TEST: Verification
            const verify = await this.getSecrets(path);
            if (JSON.stringify(verify) !== JSON.stringify(data)) {
                console.log('Secrets verification failed');
                console.log('Original:', data);
                console.log('Returned:', verify);
                throw new Error('Secrets verification failed');
            }
            console.log(`MONGODB-SECRETS: VERIFIED secret ${path}`);
        }
    }
}
