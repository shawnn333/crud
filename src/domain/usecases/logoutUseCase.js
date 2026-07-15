export class LogoutUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute() {
    return this.authRepository.logout();
  }
}
