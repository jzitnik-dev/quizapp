package cz.jzitnik.quizapp.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import cz.jzitnik.quizapp.payload.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;

/**
 * Handles all exceptions thrown by any REST controller.
 *
 * <p>This ensures that all unhandled exceptions are caught and converted to {@link ErrorResponse}.
 *
 * @see ErrorResponse
 */
@RestControllerAdvice
public class ErrorHandler {

    /**
     * Handles any {@code throwable} that occurs during the execution of a request and responds with an
     * {@code ErrorResponse} containing the original request URL and the error message.
     *
     * @param request The {@link HttpServletRequest} that triggered the exception
     * @param throwable The exception that was thrown
     * @return An {@link ErrorResponse} containing the request URL and the error message
     */
    @ExceptionHandler(Throwable.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public @ResponseBody ErrorResponse handleAll(HttpServletRequest request, Throwable throwable) {
        return new ErrorResponse(request.getRequestURL().toString(), throwable);
    }
}
