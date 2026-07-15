import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository.js';
import { db, auth } from '../firebase/firebaseConfig.js';

export class FirebaseTaskRepository extends ITaskRepository {
  getUid() {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error('You must be signed in to manage tasks.');
    }
    return uid;
  }

  tasksCollection() {
    return collection(db, 'users', this.getUid(), 'tasks');
  }

  toDate(value) {
    if (!value) return new Date();
    if (value instanceof Timestamp) return value.toDate();
    return new Date(value);
  }

  mapDoc(docSnap) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      title: data.title || '',
      completed: !!data.completed,
      createdAt: this.toDate(data.createdAt).toISOString(),
      updatedAt: this.toDate(data.updatedAt).toISOString(),
    };
  }

  async addTask(task) {
    const taskData = task.toJSON ? task.toJSON() : task;

    if (!taskData.title) {
      throw new Error('Task title is required');
    }

    try {
      const uid = this.getUid();
      console.log(`📝 Adding task: "${taskData.title}" for user: ${uid}`);

      const newTaskData = {
        title: taskData.title,
        completed: false,
        createdAt: taskData.createdAt ? new Date(taskData.createdAt) : serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Use the id the domain entity already generated (Task.create) so
      // the caller never needs anything handed back from the repository.
      const ref = doc(db, 'users', uid, 'tasks', String(taskData.id));
      await setDoc(ref, newTaskData);
      console.log(`✅ Task added with ID: ${taskData.id}`);
    } catch (error) {
      console.error(`❌ Failed to add task: ${error.message}`);
      throw new Error('Failed to add task: ' + error.message);
    }
  }

  async removeTask(task) {
    const id = typeof task === 'object' ? task.id : task;
    console.log(`🗑️ Removing task: ${id}`);

    const ref = doc(db, 'users', this.getUid(), 'tasks', String(id));
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      console.log(`⚠️ Task not found: ${id}`);
      return;
    }
    await deleteDoc(ref);
    console.log(`✅ Task deleted: ${id}`);
  }

  async updateTask(task) {
    const id = typeof task === 'object' ? task.id : task;
    console.log(`✏️ Updating task: ${id}`);
    
    const ref = doc(db, 'users', this.getUid(), 'tasks', String(id));
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      console.log(`⚠️ Task not found: ${id}`);
      return;
    }

    const taskData = task.toJSON ? task.toJSON() : task;
    const updates = { 
      updatedAt: serverTimestamp() 
    };
    
    if (taskData.title) updates.title = taskData.title;
    if (taskData.completed !== undefined) updates.completed = taskData.completed;
    
    await updateDoc(ref, updates);
    console.log(`✅ Task updated: ${id}`);
  }

  async getAllTasks() {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        console.log(`🔍 No user logged in, returning empty array`);
        return [];
      }
      
      console.log(`📖 Fetching all tasks for user: ${uid}`);
      const collectionRef = collection(db, 'users', uid, 'tasks');
      const snap = await getDocs(collectionRef);
      const tasks = snap.docs.map((d) => this.mapDoc(d));
      console.log(`📊 Found ${tasks.length} tasks`);
      return tasks;
    } catch (error) {
      if (error.message?.includes('signed in') || 
          error.code === 'permission-denied' || 
          error.message?.includes('permission')) {
        console.log(`🔒 Permission denied, returning empty array`);
        return [];
      }
      console.error(`❌ Error fetching tasks: ${error.message}`);
      throw error;
    }
  }

  async getTask(id) {
    console.log(`🔍 Getting task: ${id}`);
    const ref = doc(db, 'users', this.getUid(), 'tasks', String(id));
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      console.log(`⚠️ Task not found: ${id}`);
      return null;
    }
    const result = this.mapDoc(snap);
    console.log(`✅ Task found:`, result);
    return result;
  }

  async toggleComplete(task) {
    const id = typeof task === 'object' ? task.id : task;
    console.log(`🔄 Toggling task: ${id}`);
    const ref = doc(db, 'users', this.getUid(), 'tasks', String(id));
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      console.log(`⚠️ Task not found: ${id}`);
      return;
    }

    // The domain entity already flipped its own `completed` flag before
    // reaching the repository - we just persist that state.
    await updateDoc(ref, {
      completed: task.completed,
      updatedAt: serverTimestamp(),
    });
    console.log(`✅ Task toggled: ${id} → ${task.completed ? 'Done' : 'Pending'}`);
  }

  async getByStatus(completed) {
    const q = query(this.tasksCollection(), where('completed', '==', completed));
    const snap = await getDocs(q);
    return snap.docs.map((d) => this.mapDoc(d));
  }

  async search(query_) {
    const all = await this.getAllTasks();
    if (!query_ || !query_.trim()) return all;
    const term = query_.toLowerCase().trim();
    return all.filter((t) => t.title.toLowerCase().includes(term));
  }

  async clearAll() {
    console.log(`🗑️ Clearing all tasks`);
    const snap = await getDocs(this.tasksCollection());
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
    console.log(`✅ All tasks cleared`);
  }

  async count() {
    const snap = await getDocs(this.tasksCollection());
    return snap.size;
  }
}