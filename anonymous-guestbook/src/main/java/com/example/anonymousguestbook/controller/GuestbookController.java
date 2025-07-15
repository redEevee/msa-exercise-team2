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
    @PutMapping("/{id}")
    public ResponseEntity<String> updateGuestbook(@PathVariable Long id, @RequestBody Guestbook updateGuestbook) {
        Optional<Guestbook> optionalGuestbook = guestbookRepository.findById(id);

        if (optionalGuestbook.isPresent()) {
            Guestbook existing = optionalGuestbook.get();

            if (!existing.getPassword().equals(updateGuestbook.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
            }

            existing.setContent(updateGuestbook.getContent());
            existing.setNickname(updateGuestbook.getNickname());
            guestbookRepository.save(existing);
            return ResponseEntity.ok("수정 성공");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // 글 삭제
    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteGuestbook(@PathVariable Long id, @RequestBody Guestbook request) {
        Optional<Guestbook> optional = guestbookRepository.findById(id);

        if (optional.isPresent()) {
            Guestbook guestbook = optional.get();

            if (!guestbook.getPassword().equals(request.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
            }

            guestbookRepository.deleteById(id);
            return ResponseEntity.ok("삭제 성공");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 ID의 방명록이 없습니다.");
    }
}