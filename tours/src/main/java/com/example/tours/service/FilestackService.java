package com.example.tours.service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.filestack.Client;
import org.filestack.FileLink;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.tours.dto.response.UploadResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FilestackService {
    private final Client client;

    public UploadResponse uploadFile(MultipartFile file) {

        try {
            File tempFile = File.createTempFile(
                    "upload-",
                    file.getOriginalFilename());

            file.transferTo(tempFile);

            FileLink uploadedFile = client.upload(
                    tempFile.getAbsolutePath(),
                    false);

            tempFile.delete();

            String handle = uploadedFile.getHandle();

            // Filestack CDN URL chuẩn
            String url = "https://cdn.filestackcontent.com/" + handle;

            return new UploadResponse(
                    handle,
                    url);
        } catch (Exception e) {
            throw new RuntimeException("Filestack upload failed", e);
        }
    }

    public List<UploadResponse> uploadMultipleFiles(
            List<MultipartFile> files) {
        List<UploadResponse> uploadedFiles = new ArrayList<>();

        for (MultipartFile file : files) {
            uploadedFiles.add(uploadFile(file));
        }

        return uploadedFiles;
    }

    
}
