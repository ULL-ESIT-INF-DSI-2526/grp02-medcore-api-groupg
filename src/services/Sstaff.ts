import { Staff, IStaff } from '../models/staff.js';

/**
 * Clase de servicio para gestionar las operaciones del personal
 */
export class StaffService {
  /**
   * Registra un nuevo miembro del personal
   * @param data Datos del miembro del personal
   * @returns El documento creado
   */
  static async create(data: Partial<IStaff>): Promise<IStaff> {
    return await Staff.create(data);
  }

  /**
   * Busca miembros del personal segun criterios
   * @param query Filtro de busqueda
   * @returns Lista de miembros encontrados
   */
  static async find(query: object): Promise<IStaff[]> {
    return await Staff.find(query);
  }

  /**
   * Busca un miembro por su identificador unico de base de datos
   * @param id ID de MongoDB
   * @returns Miembro encontrado o null
   */
  static async findById(id: string): Promise<IStaff | null> {
    return await Staff.findById(id);
  }

  /**
   * Actualiza la informacion del personal
   * @param query Criterio de busqueda
   * @param data Nuevos datos
   * @returns Documento actualizado o null
   */
  static async update(query: object, data: Partial<IStaff>): Promise<IStaff | null> {
    return await Staff.findOneAndUpdate(query, data, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Elimina un miembro del personal del sistema
   * @param query Criterio de busqueda
   * @returns Documento eliminado o null
   */
  static async delete(query: object): Promise<IStaff | null> {
    return await Staff.findOneAndDelete(query);
  }
}