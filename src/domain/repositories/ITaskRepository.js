/**
 * ITaskRepository - Domain task contract (pure interface).
 *
 * Convention (per team review):
 * - Mutation methods (addTask, updateTask, removeTask, toggleComplete,
 *   clearAll) take a full domain entity where applicable and return void.
 *   Callers already hold the entity they mutated/created, so they don't
 *   need anything handed back - they just keep using their own reference.
 * - Query methods (getAllTasks, getTask, getByStatus, search, count)
 *   return data.
 *
 * No logic here, only the contract. Only this file should change when
 * the contract itself changes.
 */
export class ITaskRepository {

  /**
   * @param {import('../entities/Task').Task} task
   * @returns {Promise<void>}
   */
  async addTask(task) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {import('../entities/Task').Task} task
   * @returns {Promise<void>}
   */
  async removeTask(task) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {import('../entities/Task').Task} task
   * @returns {Promise<void>}
   */
  async updateTask(task) {
    throw new Error('Method not implemented');
  }

  /**
   * @returns {Promise<object[]>} plain, serialized tasks
   */
  async getAllTasks() {
    throw new Error('Method not implemented');
  }

  /**
   * @param {string|number} id
   * @returns {Promise<object|null>} plain, serialized task
   */
  async getTask(id) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {import('../entities/Task').Task} task
   * @returns {Promise<void>}
   */
  async toggleComplete(task) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {boolean} completed
   * @returns {Promise<object[]>}
   */
  async getByStatus(completed) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {string} query
   * @returns {Promise<object[]>}
   */
  async search(query) {
    throw new Error('Method not implemented');
  }

  /**
   * @returns {Promise<void>}
   */
  async clearAll() {
    throw new Error('Method not implemented');
  }

  /**
   * @returns {Promise<number>}
   */
  async count() {
    throw new Error('Method not implemented');
  }
}
