package com.example.demo.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TextMessageDto extends MessageDto {
    private String content;

    public TextMessageDto(String role, String content) {
        super(role);
        this.content = content;
    }
}
