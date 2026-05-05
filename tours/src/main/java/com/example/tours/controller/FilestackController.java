package com.example.tours.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.tours.dto.response.UploadResponse;
import com.example.tours.service.FilestackService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tours/filestack")
@RequiredArgsConstructor
public class FilestackController {
    private final FilestackService filestackService;

    @PostMapping("/image")
    public UploadResponse uploadImage(
            @RequestParam("file") MultipartFile file) {
        return filestackService.uploadFile(file);
    }

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<UploadResponse> uploadImages(
            @RequestParam("files") List<MultipartFile> files) {
        return filestackService.uploadMultipleFiles(files);
    }
}
