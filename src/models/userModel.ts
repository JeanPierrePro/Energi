import { db } from '../config/firebase';

// Função para criar um novo usuário
export const createUser = async (userData: { email: string, name: string, phone: string, nif: string }) => {
  try {
    const userRef = db.collection('users').doc(userData.email);  // Usando o e-mail como identificador único
    await userRef.set({ 
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        nif: userData.nif
    });  
    console.log('Usuário criado com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar usuário:', error);
    throw error;
  }
};

// Função para buscar usuário por e-mail
export const getUserByEmail = async (email: string) => {
  try {
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      return userDoc.data();
    } else {
      console.log('Usuário não encontrado!');
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar o usuário:', error);
    throw error;
  }
};

// Função para atualizar usuário
export const updateUser = async (userId: string, updatedData: { username: string, email: string, phone: string, nif: string }) => {
  try {
    const userRef = db.collection('users').doc(userId);
    await userRef.update(updatedData);  // Atualiza os dados do usuário
    const updatedUserDoc = await userRef.get();
    return updatedUserDoc.data();
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};
