import { HttpException, Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ImageData, SupabaseResponse } from '../model/image.dto';
import { getDataImageBase64, uploadToStorage } from '../utils/helper.utils';

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(process.env.STORAGE_URL, process.env.API_SECRET);
    }

    async uploadImageService(base64: string, type: string, fileNameUser?: string) {
        const { fileName, extension, base64Data, MimeType }: ImageData = getDataImageBase64(base64)

        try {
            let response: SupabaseResponse;
            const path = type === 'NewImage'? `${fileName}.${extension}` : fileNameUser

            if (type) {
                response = await uploadToStorage(this.supabase, path, base64Data, MimeType, type)
            } else {
                throw new HttpException('Something went wrong', 400)
            }

            if (response.error) {
                throw new HttpException(response.error.message, 400)
            }

            return response.data.path
        } catch (error) {
            throw new HttpException(error.message, 400)
        }
    }
}