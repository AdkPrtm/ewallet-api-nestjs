import { HttpException } from '@nestjs/common';
import { decode } from 'base64-arraybuffer';
import * as crypto from 'crypto';
import { ImageData, SupabaseResponse } from '../model/image.dto';


export function generateNumber(length: number): string {
    const chars: string = '0123456789'
    let result: string = ''
    for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
export function getDataImageBase64(base64: string, fileNameDefault?: string): ImageData {

    const [mimeData, base64Data] = base64.split(',');
    const MimeType = mimeData.split(';')[0].split(':')[1];
    const extension = MimeType.split('/')[1]
    const allowedExtensions = ['jpeg', 'jpg', 'png']

    if (!allowedExtensions.includes(extension)) throw new HttpException(`Invalid file extension`, 400)

    const fileName = fileNameDefault ?? crypto.randomBytes(16).toString('hex').slice(0, 16)
    return {
        fileName,
        extension,
        base64Data,
        MimeType
    };
}

export async function uploadToStorage(supabase: any, path: string, base64Data: string, MimeType: string, type: string): Promise<SupabaseResponse> {
    if (type === 'NewImage') {
        return await supabase.storage.from('ewalletapp').upload(path, decode(base64Data), {
            contentType: MimeType,
        });
    } else if (type === 'UpdateImage') {
        return await supabase.storage.from('ewalletapp').update(path, decode(base64Data), {
            contentType: MimeType,
        });
    }
}