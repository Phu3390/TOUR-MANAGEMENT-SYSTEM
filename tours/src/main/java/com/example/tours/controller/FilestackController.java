package com.example.tours.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
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

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping("/image")
    public UploadResponse uploadImage(
            @RequestParam("file") MultipartFile file) {
        return filestackService.uploadFile(file);
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public List<UploadResponse> uploadImages(
            @RequestParam("files") List<MultipartFile> files) {
        return filestackService.uploadMultipleFiles(files);
    }
}
