export interface ImageData {
    fileName: string;
    extension: string;
    base64Data: string;
    MimeType: string;
}

export interface SupabaseResponse {
    data: any;
    error: { message: string };
}