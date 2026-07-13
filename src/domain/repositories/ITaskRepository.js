/**
 * ITaskRepository - Domain repository contract (pure interface).
 *
 * This is ONLY a contract. It must never contain real logic, storage
 * details, or default/convenience implementations - those belong in
 * the concrete classes under src/data/repositories/*.
 *
 * Only this file should change when the contract itself changes.
 * Implementations (InMemoryTaskRepository, LocalStorageTaskRepository, ...)
 * implement it; use cases depend on it, never on a concrete class.
 */
export class ITaskRepository {
  /**
   * Create a new task
   * @param {string} title - Task title
   * @param {string|Date} [createdAt] - Optional creation date override
   * @returns {Promise<Task>} Created task
   */
  async addTask(title, createdAt) {
    throw new Error('Method not implemented');
  }

  /**
   * Remove a task by ID
   * @param {number|string} id - Task ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async removeTask(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Update a task
   * @param {number|string} id - Task ID
   * @param {Object} data - Task data to update
   * @returns {Promise<Task|null>} Updated task or null if not found
   */
  async updateTask(id, data) {
    throw new Error('Method not implemented');
  }

  /**
   * Get all tasks
   * @returns {Promise<Task[]>} Array of tasks
   */
  async getAllTasks() {
    throw new Error('Method not implemented');
  }

  /**
   * Get a task by ID
   * @param {number|string} id - Task ID
   * @returns {Promise<Task|null>} Task or null if not found
   */
  async getTask(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Toggle task completion
   * @param {number|string} id - Task ID
   * @returns {Promise<Task|null>} Updated task or null if not found
   */
  async toggleComplete(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Get tasks by completion status
   * @param {boolean} completed - Completion status
   * @returns {Promise<Task[]>} Array of tasks
   */
  async getByStatus(completed) {
    throw new Error('Method not implemented');
  }

  /**
   * Search tasks by title
   * @param {string} query - Search query
   * @returns {Promise<Task[]>} Array of matching tasks
   */
  async search(query) {
    throw new Error('Method not implemented');
  }

  /**
   * Clear all tasks
   * @returns {Promise<void>}
   */
  async clearAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Get task count
   * @returns {Promise<number>} Number of tasks
   */
  async count() {
    throw new Error('Method not implemented');
  }
}
