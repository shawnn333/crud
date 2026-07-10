export class GetAllTasksUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(filter = null, searchTerm = null) {
    let tasks = await this.repository.getAllTasks();

    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(term)
      );
    }

    return tasks.sort((a, b) => b.id - a.id);
  }
}
