package cz.jzitnik.quizapp.utils.json;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class LongListJsonConverter extends BaseJsonConverter<Long> {
    public LongListJsonConverter() {
        super(Long.class);
    }
}