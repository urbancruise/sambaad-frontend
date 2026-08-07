export type EmailFolder = "INBOX" | "SENT" | "DRAFTS" | "SCHEDULED" | "SPAM" | "TRASH" | "ARCHIVE";


export type EmailQueryFolder = EmailFolder | "STARRED" | "IMPORTANT";

export interface EmailUser {
    id: number;
    fullName: string;
    email: string;
    username: string;
}

export interface EmailListItem {
    id: string;
    threadId: string;
    recipientRowId: string;
    subject: string;
    preview: string;
    from: EmailUser | null;
    isRead: boolean;
    isStarred: boolean;
    isImportant: boolean;
    labels: string[];
    hasAttachments: boolean;
    attachmentCount: number;
    scheduledAt: string | null;
    sentAt: string | null;
    createdAt: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface FolderResponse {
    emails: EmailListItem[];
    pagination: Pagination;
}

export interface Attachment {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
}

export interface ThreadEmail {
    id: string;
    subject: string;
    bodyHtml: string;
    from: EmailUser | null;
    attachments: Attachment[];
    sentAt: string | null;
    createdAt: string;
    myFlags: {
        isRead: boolean;
        isStarred: boolean;
        isImportant: boolean;
        folder: EmailFolder;
    } | null;
}

export interface Label {
    id: string;
    name: string;
    color: string;
}

export interface Signature {
    id: string;
    content: string;
    isAutoAppend: boolean;
}

export interface ComposeData {
    to: number[];
    cc?: number[];
    bcc?: number[];
    subject: string;
    bodyHtml: string;
    threadId?: string;
    inReplyToId?: string;
    emailId?: string;
    scheduledAt?: string;
}

export type BulkAction = "read" | "unread" | "star" | "unstar" | "archive" | "spam" | "trash" | "inbox" | "delete";

export const FOLDER_LABELS: Record<EmailFolder, string> = {
    INBOX: "Inbox",
    SENT: "Sent",
    DRAFTS: "Drafts",
    SCHEDULED: "Scheduled",
    SPAM: "Spam",
    TRASH: "Trash",
    ARCHIVE: "Archive",
};