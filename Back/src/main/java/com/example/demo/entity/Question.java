package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "question")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String year;

    private String month;

    private String number;

    @Column(length = 50000)
    private String text;

    private String rightAnswer;

    @Column(length = 50000)
    private String description;

    private String point;

    private String type;
}
