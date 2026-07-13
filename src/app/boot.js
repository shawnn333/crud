import { LocalStorageTaskRepository } from '../data/repositories/LocalStorageTaskRepository.js';
import { AddTaskUseCase } from '../domain/usecases/addTaskUseCase.js';
import { GetAllTasksUseCase } from '../domain/usecases/getAllTasksUseCase.js';
import { GetTaskUseCase } from '../domain/usecases/getTaskUseCase.js';
import { RemoveTaskUseCase } from '../domain/usecases/removeTaskUseCase.js';
import { UpdateTaskUseCase } from '../domain/usecases/updateTaskUseCase.js';
import { ToggleTaskCompletionUseCase } from '../domain/usecases/toggleTaskCompletionUseCase.js';

// Create the single repository instance for the app.
// This is the ONLY object allowed to touch localStorage for tasks.
// Tasks you add persist across refresh; deleting a task removes it for
// good (no auto-reseeding of sample/demo tasks).
const taskRepository = new LocalStorageTaskRepository();

// Create and export use cases - these are what the Redux/state layer
// and views should depend on. Nothing above this line should be
// imported directly by components or Redux thunks.
export const addTaskUseCase = new AddTaskUseCase(taskRepository);
export const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
export const getTaskUseCase = new GetTaskUseCase(taskRepository);
export const removeTaskUseCase = new RemoveTaskUseCase(taskRepository);
export const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
export const toggleTaskCompletionUseCase = new ToggleTaskCompletionUseCase(taskRepository);

// Export repository for direct access if needed (e.g. tests)
export { taskRepository };
