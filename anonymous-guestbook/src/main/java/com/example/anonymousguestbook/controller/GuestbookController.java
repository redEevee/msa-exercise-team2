package com.example.anonymousguestbook.controller;

import com.example.anonymousguestbook.entity.Guestbook;
import com.example.anonymousguestbook.repository.GuestbookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/guestbook")
@RequiredArgsConstructor
public class GuestbookController {

    private final GuestbookRepository guestbookRepository;

    // 글 작성
    @PostMapping
    public Guestbook create(@RequestBody Guestbook guestbook) {
        return guestbookRepository.save(guestbook);
    }

    // 글 전제 조회
    @GetMapping
    public List<Guestbook> getAll() {
        // 전체 글을 조회 후 최신 순으로 정렬 후 반환
        return guestbookRepository.findAll()
                .stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
    }

    // 글 수정
    @GetMapping("/apiguestbook/read{id}")
    public Guestbook readGuestbook(@PathVariable Long id) {
        log.info("Read guestbook with id {}", id);
        Optional<Guestbook> guestbook = guestbookRepository.findById(id);

        if (guestbook.isEmpty()) {
            return null;
        }
        return guestbook.get();
    }

    // 글 삭제
    @DeleteMapping("/api/guestbook/{id}")
    public ResponseEntity<String> deleteGuestbook(@PathVariable Long id) {
        Optional<Guestbook> guestbook = guestbookRepository.findById(id);

        if (guestbook.isPresent()) {
            guestbookRepository.deleteById(id);
            return ResponseEntity.ok("삭제 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 ID의 방명록이 없습니다.");
        }
    }
}
