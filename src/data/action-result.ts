export default interface ActionResult {
    success: boolean;
    statusCode: number;
    message?: string;
    translationKey?: string;
}