package com.example.demo.service;


import com.example.demo.dto.request.ChatGPTRequest;
import com.example.demo.dto.response.ChatGPTResponse;
import com.example.demo.repository.QuestionRepository;
import com.example.demo.entity.Question;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AiCallService {
    @Value("${openai.model}")
    private String apiModel;

    @Value("${openai.api.url}")
    private String apiUrl;

    private final RestTemplate template;
    private final QuestionRepository questionRepository;

    public ChatGPTResponse requestTextAnalysis(String requestText) {
        ChatGPTRequest request = ChatGPTRequest.createTextRequest(apiModel, 500, "user", requestText);
        return template.postForObject(apiUrl, request, ChatGPTResponse.class);
    }

    public ChatGPTResponse requestImageAnalysis(MultipartFile image, String requestText) throws IOException {
        // 이미지를 Base64로 인코딩
        String base64Image = Base64.encodeBase64String(image.getBytes());
        String imageUrl = "data:image/jpeg;base64," + base64Image;

        // 이미지 분석 요청 생성
        ChatGPTRequest request = ChatGPTRequest.createImageRequest(apiModel, 500, "user", requestText, imageUrl);
        ChatGPTResponse response = template.postForObject(apiUrl, request, ChatGPTResponse.class);

        // API 응답에서 텍스트 추출
        if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
            String gptAnswer = response.getChoices().get(0).getMessage().getContent();

            // 새 Question 엔티티 생성 및 text 필드 설정
//            Question question = new Question();
//            question.setText(gptAnswer);  // API 응답 내용을 text에 저장
//            question.setType("G");        // type 필드에 "G" 저장


            // DB에 저장
//            questionRepository.save(question);
        }

        return response;
    }
}
