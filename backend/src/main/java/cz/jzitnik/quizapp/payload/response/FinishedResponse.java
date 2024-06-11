package cz.jzitnik.quizapp.payload.response;

import java.time.LocalDate;

public class FinishedResponse {
    private boolean finished;
    private LocalDate date;

    public FinishedResponse(boolean finished, LocalDate date) {
        this.finished = finished;
        this.date = date;
    }

    public boolean isFinished() {
        return finished;
    }

    public void setFinished(boolean finished) {
        this.finished = finished;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
