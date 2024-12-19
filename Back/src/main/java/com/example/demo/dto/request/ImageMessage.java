package com.example.demo.dto.request;


import com.example.demo.dto.MessageDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ImageMessage extends MessageDto {
    private List<Content> content;

    public ImageMessage(String role , List<Content> content) {
        super(role);
        this.content = content;
    }
}
