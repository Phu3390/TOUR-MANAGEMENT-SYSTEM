package com.example.auth.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRequest {
    @NotBlank(message = "EMAIL_IS_BLANK")
    @Email(message = "EMAIL_INVALID")
    String email;

    String password;

    @NotBlank(message = "FULL_NAME_IS_BLANK")
    String fullName;

    @NotNull(message = "ROLE_ID_IS_BLANK")
    UUID role_id;
}
