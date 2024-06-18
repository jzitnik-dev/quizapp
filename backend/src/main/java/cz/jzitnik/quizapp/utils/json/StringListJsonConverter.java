package cz.jzitnik.quizapp.utils.json;

import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StringListJsonConverter extends BaseJsonConverter<String> {
    public StringListJsonConverter() {
        super(String.class);
    }
}