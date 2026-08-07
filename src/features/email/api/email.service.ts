import api from "@/src/lib/axios";
import { ComposeData, EmailFolder, EmailQueryFolder, BulkAction } from "../types";

export const getFolder = async (
    folder: EmailQueryFolder,
    params?: { search?: string; label?: string; sortBy?: string; order?: string; page?: number; limit?: number }
) => {
    const response = await api.get(`/email/folder/${folder}`, { params });
    return response.data.data;
};

export const getUnreadCount = async () => {
    const response = await api.get("/email/unread-count");
    return response.data.data.count as number;
};

export const getThread = async (threadId: string) => {
    const response = await api.get(`/email/thread/${threadId}`);
    return response.data.data;
};

export const createDraft = async (data: Partial<ComposeData>) => {
    const response = await api.post("/email/draft", data);
    return response.data.data;
};

export const autosaveDraft = async (emailId: string, data: Partial<ComposeData>) => {
    const response = await api.put(`/email/draft/${emailId}`, data);
    return response.data.data;
};

export const sendEmail = async (data: ComposeData) => {
    const response = await api.post("/email/send", data);
    return response.data.data;
};

export const replyToEmail = async (
    emailId: string,
    data: { bodyHtml: string; replyAll?: boolean; forwardTo?: { to: number[]; cc?: number[] } }
) => {
    const response = await api.post(`/email/${emailId}/reply`, data);
    return response.data.data;
};

export const setFlags = async (
    emailId: string,
    patch: Partial<{ isRead: boolean; isStarred: boolean; isImportant: boolean }>
) => {
    const response = await api.patch(`/email/${emailId}/flags`, patch);
    return response.data.data;
};

export const moveToFolder = async (emailId: string, folder: EmailFolder) => {
    const response = await api.patch(`/email/${emailId}/move`, { folder });
    return response.data.data;
};

export const permanentDelete = async (emailId: string) => {
    const response = await api.delete(`/email/${emailId}`);
    return response.data.data;
};

export const bulkAction = async (emailIds: string[], action: BulkAction) => {
    const response = await api.post("/email/bulk", { emailIds, action });
    return response.data.data;
};

export const attachFile = async (emailId: string, file: File, onProgress?: (pct: number) => void) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/email/${emailId}/attachments`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
            if (onProgress && evt.total) onProgress(Math.round((evt.loaded / evt.total) * 100));
        },
    });
    return response.data.data;
};

export const searchRecipients = async (q: string) => {
    const response = await api.get("/email/recipients/search", { params: { q } });
    return response.data.data;
};

export const getLabels = async () => {
    const response = await api.get("/email/labels");
    return response.data.data;
};

export const createLabel = async (name: string, color?: string) => {
    const response = await api.post("/email/labels", { name, color });
    return response.data.data;
};

export const deleteLabel = async (labelId: string) => {
    return api.delete(`/email/labels/${labelId}`);
};

export const getSignature = async () => {
    const response = await api.get("/email/signature");
    return response.data.data;
};

export const upsertSignature = async (content: string, isAutoAppend: boolean) => {
    const response = await api.put("/email/signature", { content, isAutoAppend });
    return response.data.data;
};