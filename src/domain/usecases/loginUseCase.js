export class LoginUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(email, password) {
    if (!email || !email.trim()) {
      throw new Error('Email is required');
    }
    if (!password) {
      throw new Error('Password is required');
    }
    return this.authRepository.login(email.trim(), password);
  }
}
