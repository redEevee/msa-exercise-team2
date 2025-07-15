@Service
@RequiredArgsConstructor
public class AccountService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AccountResponse signup(SignupRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return new AccountResponse(false, "이미 존재하는 사용자입니다.", null);
        }

        String encoded = passwordEncoder.encode(request.getPassword());
        userRepository.save(new User(null, request.getUsername(), encoded));
        return new AccountResponse(true, "회원가입 성공", null);
    }

    public AccountResponse login(LoginRequest request) {
        return userRepository.findByUsername(request.getUsername())
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .map(user -> new AccountResponse(true, "로그인 성공", jwtTokenProvider.generateToken(user.getUsername())))
                .orElseGet(() -> new AccountResponse(false, "로그인 실패", null));
    }
}
