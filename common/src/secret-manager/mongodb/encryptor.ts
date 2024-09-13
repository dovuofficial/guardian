import * as crypto from 'crypto';

class Encryptor {
    private readonly algorithm = 'aes-256-cbc';
    private readonly key: Buffer | null;
    private readonly encryptionEnabled: boolean;
    private readonly encryptedPrefix = 'ENC:';
    public static readonly KEYNAME = "MONGO_ENCRYPTION_KEY";

    constructor() {
        const envKey = process.env[Encryptor.KEYNAME];
        if (!envKey) {
            this.key = null;
            this.encryptionEnabled = false;
        } else {
            this.key = crypto.scryptSync(envKey, 'salt', 32);
            this.encryptionEnabled = true;
        }
    }

    encrypt(text: string): string {
        if (!this.encryptionEnabled) {
            return text;
        }
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key!, iv);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        const salt = iv.toString('base64');
        return this.encryptedPrefix + `${salt}~${encrypted}`;
    }

    decrypt(text: string): string {
        if (!text.startsWith(this.encryptedPrefix)) {
            return text;
        }
        if (!this.encryptionEnabled) {
            console.warn('Attempted to decrypt, but encryption is disabled. Returning original text.');
            return text.slice(this.encryptedPrefix.length);
        }
        const encryptedText = text.slice(this.encryptedPrefix.length);
        const [salt, encrypted] = encryptedText.split('~');
        const iv = Buffer.from(salt, 'base64');
        const decipher = crypto.createDecipheriv(this.algorithm, this.key!, iv);
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

export default Encryptor;
