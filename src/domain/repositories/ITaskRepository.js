export class ITaskRepository {
  /**
   * Create a new task
   * @param {string} title - Task title
   * @returns {Promise<Task>} Created task
   */
  async addTask(title) {
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

  async getAll() {
    return this.getAllTasks();
  }

  async getById(id) {
    return this.getTask(id);
  }

  async create(title) {
    return this.addTask(title);
  }

  async update(id, data) {
    return this.updateTask(id, data);
  }

  async delete(id) {
    return this.removeTask(id);
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