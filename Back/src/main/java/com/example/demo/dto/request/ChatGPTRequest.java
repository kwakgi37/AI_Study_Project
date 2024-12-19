package com.example.demo.dto.request;


import com.example.demo.dto.MessageDto;
import com.example.demo.dto.TextMessageDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Collections;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatGPTRequest {
    @JsonProperty("model")
    private String model;
    @JsonProperty("messages")
    private List<MessageDto> messages;
    @JsonProperty("max_tokens")
    private int maxTokens;


    public static ChatGPTRequest createImageRequest(String model, int maxTokens, String role, String requestText, String imageUrl) {
        TextContent textContent = new TextContent("text", requestText);
        ImageContent imageContent = new ImageContent("image_url", new ImageUrl(imageUrl));
        MessageDto message = new ImageMessage(role,List.of(textContent,imageContent));
        return createChatGPTRequest(model, maxTokens, Collections.singletonList(message));
    }

    public static ChatGPTRequest createTextRequest(String model, int maxTokens, String role, String requestText){
        MessageDto message = new TextMessageDto(role,requestText);
        return createChatGPTRequest(model, maxTokens, Collections.singletonList(message));
    }

    private static ChatGPTRequest createChatGPTRequest(String model, int maxTokens, List<MessageDto> messages) {
        return ChatGPTRequest.builder()
                .model(model)
                .maxTokens(maxTokens)
                .messages(messages)
                .build();
    }

}
