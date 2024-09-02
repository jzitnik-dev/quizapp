package cz.jzitnik.quizapp.entities;

import jakarta.persistence.*;

@Entity
public class GlobalMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String markdownContent;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private EGlobalMessageType type;

    public GlobalMessage(String markdownContent, EGlobalMessageType type) {
        this.markdownContent = markdownContent;
        this.type = type;
    }

    public GlobalMessage() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMarkdownContent() {
        return markdownContent;
    }

    public void setMarkdownContent(String markdownContent) {
        this.markdownContent = markdownContent;
    }

    public EGlobalMessageType getType() {
        return type;
    }

    public void setType(EGlobalMessageType type) {
        this.type = type;
    }
}
