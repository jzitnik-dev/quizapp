package cz.jzitnik.quizapp.payload.response;

/**
 * Represents a general error thrown by a REST API.
 *
 * @param url The original request URL
 * @param message The error message, which can be null
 */
public record ErrorResponse(String url, String message) {

    /**
     * Constructor.
     *
     * <p>Error message is extracted from the given {@code throwable}.
     *
     * @param url The original request URL
     * @param throwable The {@code Throwable} that caused the error
     */
    public ErrorResponse(String url, Throwable throwable) {
        this(url, throwable.getMessage());
    }
}
