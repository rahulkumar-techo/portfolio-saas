/**
 * User Service
 * Handles user business logic
 */

import { UserRepository } from '@/repositories/user.repository'

interface UserInterface {
  name?: string
  title?: string
  email?: string
  location?: string
  github?: string
  linkedin?: string
}

class UserService {
  private userRepo = new UserRepository()

  async updateUserInfo(userId: string, data: Partial<UserInterface>) {
    const updatedUser = await this.userRepo.updateById(userId, data)

    if (!updatedUser) {
      throw new Error("User not found")
    }

    return updatedUser
  }

  async getUserInfo(userId: string) {
    const user = await this.userRepo.findById(userId)

    if (!user) {
      throw new Error("User not found")
    }

    return {
      name: user.name,
      title: user.title,
      email: user.email,
      location: user.location,
      github: user.github,
      linkedin: user.linkedin,
    }
  }
}

const userService = new UserService()

export default userService
