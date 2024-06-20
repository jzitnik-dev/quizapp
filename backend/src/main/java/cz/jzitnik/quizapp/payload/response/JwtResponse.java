package cz.jzitnik.quizapp.payload.response;

import java.util.List;

public class JwtResponse {
  private String token;
  private String refreshToken;
  private String type = "Bearer";
  private Long id;
  private String username;
  private List<String> roles;

  public JwtResponse(String accessToken, String refreshToken, Long id, String username, List<String> roles) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    this.id = id;
    this.username = username;
    this.roles = roles;
  }

  public String getAccessToken() {
    return token;
  }

  public void setAccessToken(String accessToken) {
    this.token = accessToken;
  }

  public String getTokenType() {
    return type;
  }

  public void setTokenType(String tokenType) {
    this.type = tokenType;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getRefreshToken() {
    return refreshToken;
  }

  public void setRefreshToken(String refreshToken) {
    this.refreshToken = refreshToken;
  }

  public List<String> getRoles() {
    return roles;
  }
}
