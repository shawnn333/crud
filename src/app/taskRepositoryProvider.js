import { LocalStorageTaskRepository } from '../data/repositories/LocalStorageTaskRepository.js';
import { InMemoryTaskRepository } from '../data/repositories/InMemoryTaskRepository.js';

export const RepositoryType = {
  LOCAL_STORAGE: 'localStorage',
  IN_MEMORY: 'inMemory',
};

let repositoryInstance = null;
let repositoryType = RepositoryType.LOCAL_STORAGE;

const createRepository = (type) => {
  switch (type) {
    case RepositoryType.LOCAL_STORAGE:
      const localStorageRepo = new LocalStorageTaskRepository();

      localStorageRepo.addSampleDataIfEmpty();
      return localStorageRepo;
    case RepositoryType.IN_MEMORY:
      const inMemoryRepo = new InMemoryTaskRepository();

      inMemoryRepo.addSampleData();
      return inMemoryRepo;
    default:
      throw new Error(`Unknown repository type: ${type}`);
  }
};


export const resetRepository = (type = repositoryType) => {
  repositoryInstance = null;
  repositoryType = type;
  return getTaskRepository(type);
};


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


export default getTaskRepository();
