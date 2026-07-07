export class ITaskRepository {
  /**
   * Get all tasks
   * @returns {Promise<Task[]>} Array of tasks
   */
  async getAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Get a task by ID
   * @param {number|string} id - Task ID
   * @returns {Promise<Task|null>} Task or null if not found
   */
  async getById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Create a new task
   * @param {string} title - Task title
   * @returns {Promise<Task>} Created task
   */
  async create(title) {
    throw new Error('Method not implemented');
  }

  /**
   * Update a task
   * @param {number|string} id - Task ID
   * @param {Object} data - Task data to update
   * @returns {Promise<Task|null>} Updated task or null if not found
   */
  async update(id, data) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete a task
   * @param {number|string} id - Task ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id) {
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