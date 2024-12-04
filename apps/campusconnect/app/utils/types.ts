/**
 * Represents the possible outcomes of an action operation.
 * @enum {string}
 */
export enum Result {
    /** Operation completed successfully */
    Success = 'success',
    /** Operation failed due to a system or runtime error */
    Error = 'error',
    /** Operation failed due to invalid input data */
    ValidationError = 'validation-error',
}

/**
 * Represents the standardized response structure for action operations.
 * @template T - The type of the data payload in case of successful operations
 * @example
 * // Simple success response
 * const success: ActionResult = {
 *     result: Result.Success,
 *     message: "Operation completed successfully"
 * };
 *
 * // Success with data payload
 * const successWithData: ActionResult<{id: string}> = {
 *     result: Result.Success,
 *     message: "Post created successfully",
 *     data: { id: "123" }
 * };
 *
 * // Simple Error response
 * const error: ActionResult = {
 *    result: Result.Error,
 *    message: "An error occurred while processing your request"
 * };
 *
 * // Validation error response
 * const validationError: ActionResult = {
 *     result: Result.ValidationError,
 *     message: "Please check your input",
 *     errors: {
 *         email: "Invalid email format",
 *         password: "Password too short"
 *     }
 * };
 */
export type ActionResult<T = unknown> = {
    /** The result status of the operation */
    result: Result;
    /** A human-readable message describing the outcome */
    message: string;
    /** Optional payload containing the operation's result data */
    data?: T;
    /** Optional object containing validation errors keyed by field name */
    errors?: Record<string, string>;
};
