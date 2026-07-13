export class ITaskRepository {

  async addTask(title, createdAt) {
    throw new Error('Method not implemented');
  }

  async removeTask(id) {
    throw new Error('Method not implemented');
  }

  async updateTask(id, data) {
    throw new Error('Method not implemented');
  }

  async getAllTasks() {
    throw new Error('Method not implemented');
  }

  async getTask(id) {
    throw new Error('Method not implemented');
  }

  async toggleComplete(id) {
    throw new Error('Method not implemented');
  }


  async getByStatus(completed) {
    throw new Error('Method not implemented');
  }

  async search(query) {
    throw new Error('Method not implemented');
  }

  async clearAll() {
    throw new Error('Method not implemented');
  }

  async count() {
    throw new Error('Method not implemented');
  }
}
