package cz.jzitnik.quizapp.payload.request;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {
    @Size(max = 50)
    private String displayName;

    @Size(max = 350)
    private String bio;

    public UpdateProfileRequest(String displayName, String bio) {
        this.displayName = displayName;
        this.bio = bio;
    }

    public @Size(max = 50) String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(@Size(max = 50) String displayName) {
        this.displayName = displayName;
    }

    public @Size(max = 350) String getBio() {
        return bio;
    }

    public void setBio(@Size(max = 350) String bio) {
        this.bio = bio;
    }
}
