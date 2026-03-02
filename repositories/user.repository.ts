import User from '@/models/users/user.model';

export class UserRepository {
    async findByEmail(email: string) {
        return User.findOne({ email });
    }

    async findById(id: string) {
        return User.findById(id);
    }

    async create(userData: any) {
        const user = new User(userData);
        return user.save();
    }

    async updateById(id: string, update: any) {
        return User.findByIdAndUpdate(id, update, { new: true });
    }

    async deleteById(id: string) {
        return User.findByIdAndDelete(id);
    }
}
