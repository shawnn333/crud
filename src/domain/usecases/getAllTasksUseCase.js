export class GetAllTasksUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(filter = null, searchTerm = null) {
    let tasks = await this.repository.getAll();

    // Apply search if provided
    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(term)
      );
    }

    // Sort by id descending
    return tasks.sort((a, b) => b.id - a.id);
  }
}