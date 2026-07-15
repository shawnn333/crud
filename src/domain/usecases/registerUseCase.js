export class RegisterUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(email, password) {
    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    return this.authRepository.register(email.trim(), password);
  }
}
