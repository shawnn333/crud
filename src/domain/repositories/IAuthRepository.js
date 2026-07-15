/**
 * IAuthRepository - Domain auth contract (pure interface).
 * Same rule as ITaskRepository: no logic here, only the contract.
 * Only this file should change when the contract itself changes.
 */
export class IAuthRepository {
  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{uid: string, email: string}>}
   */
  async login(email, password) {
    throw new Error('Method not implemented');
  }

  /**
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{uid: string, email: string}>}
   */
  async register(email, password) {
    throw new Error('Method not implemented');
  }

  async logout() {
    throw new Error('Method not implemented');
  }

  /**
   * @returns {{uid: string, email: string} | null}
   */
  getCurrentUser() {
    throw new Error('Method not implemented');
  }

  /**
   * Subscribe to auth state changes.
   * @param {(user: {uid: string, email: string} | null) => void} callback
   * @returns {() => void} unsubscribe function
   */
  onAuthStateChanged(callback) {
    throw new Error('Method not implemented');
  }
}
