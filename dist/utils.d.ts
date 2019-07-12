import { FieldPath } from './field';
export declare const requestFileUpload: (multiple: boolean) => Promise<unknown>;
export declare const requestDownload: (options: any) => void;
export declare function deepGet(target: any, keys: FieldPath, i?: number): any;
export declare function deepSet(target: any, keys: FieldPath, newValue: any, i?: number, parentCursor?: any): any;
export declare function randomID(): string;
