import { LocalStorageTaskRepository } from '../data/repositories/LocalStorageTaskRepository.js';
import { InMemoryTaskRepository } from '../data/repositories/InMemoryTaskRepository.js';

// Repository types
export const RepositoryType = {
  LOCAL_STORAGE: 'localStorage',
  IN_MEMORY: 'inMemory',
};

// Singleton instance
let repositoryInstance = null;
let repositoryType = RepositoryType.LOCAL_STORAGE;

/**
 * Get the task repository instance
 * @param {string} type - Repository type (localStorage or inMemory)
 * @returns {ITaskRepository} Repository instance
 */
export const getTaskRepository = (type = repositoryType) => {
  if (!repositoryInstance || type !== repositoryType) {
    repositoryType = type;
    repositoryInstance = createRepository(type);
  }
  return repositoryInstance;
};

/**
 * Create a repository instance
 * @param {string} type - Repository type
 * @returns {ITaskRepository} Repository instance
 */
const createRepository = (type) => {
  switch (type) {
    case RepositoryType.LOCAL_STORAGE:
      const localStorageRepo = new LocalStorageTaskRepository();
      // Add sample data if empty
      localStorageRepo.addSampleDataIfEmpty();
      return localStorageRepo;
    case RepositoryType.IN_MEMORY:
      const inMemoryRepo = new InMemoryTaskRepository();
      // Add sample data for demonstration
      inMemoryRepo.addSampleData();
      return inMemoryRepo;
    default:
      throw new Error(`Unknown repository type: ${type}`);
  }
};

/**
 * Clear and reset the repository
 * @param {string} type - Repository type
 */
export const resetRepository = (type = repositoryType) => {
  repositoryInstance = null;
  repositoryType = type;
  return getTaskRepository(type);
};

/**
 * Get all use cases
 * @param {ITaskRepository} repository - Repository instance
 * @returns {Object} Use cases
 */
export const getUseCases = (repository = getTaskRepository()) => {
  const { AddTaskUseCase } = require('../domain/usecases/addTaskUseCase');
  const { GetAllTasksUseCase } = require('../domain/usecases/getAllTasksUseCase');
  const { GetTaskUseCase } = require('../domain/usecases/getTaskUseCase');
  const { RemoveTaskUseCase } = require('../domain/usecases/removeTaskUseCase');
  const { UpdateTaskUseCase } = require('../domain/usecases/updateTaskUseCase');

  return {
    addTask: new AddTaskUseCase(repository),
    getAllTasks: new GetAllTasksUseCase(repository),
    getTask: new GetTaskUseCase(repository),
    removeTask: new RemoveTaskUseCase(repository),
    updateTask: new UpdateTaskUseCase(repository),
  };
};

// Export a default instance with localStorage
export default getTaskRepository();