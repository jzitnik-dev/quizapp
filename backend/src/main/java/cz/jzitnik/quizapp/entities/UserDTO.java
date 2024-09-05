package cz.jzitnik.quizapp.entities;

public class UserDTO {
    private String username;
    private String displayName;

    public UserDTO(User user) {
        this.username = user.getUsername();
        this.displayName = user.getDisplayName();
    }

    public UserDTO(String username, String displayName) {
        this.username = username;
        this.displayName = displayName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
