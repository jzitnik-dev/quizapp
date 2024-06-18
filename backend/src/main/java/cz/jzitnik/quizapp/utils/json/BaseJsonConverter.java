package cz.jzitnik.quizapp.utils.json;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import jakarta.persistence.AttributeConverter;

import java.io.IOException;
import java.util.List;

public abstract class BaseJsonConverter<T> implements AttributeConverter<List<T>, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Class<T> type;

    protected BaseJsonConverter(Class<T> type) {
        this.type = type;
    }

    @Override
    public String convertToDatabaseColumn(List<T> attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Error converting list to JSON", e);
        }
    }

    @Override
    public List<T> convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            CollectionType collectionType = objectMapper.getTypeFactory().constructCollectionType(List.class, type);
            return objectMapper.readValue(dbData, collectionType);
        } catch (IOException e) {
            throw new IllegalArgumentException("Error converting JSON to list", e);
        }
    }
}
