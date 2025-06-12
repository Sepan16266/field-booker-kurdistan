import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

const JWT_SECRET = process.env.JWT_SECRET || 'secure-football-booking-system-2024';

export async function loginUser(username: string, password: string) {
  try {
    console.log('Login attempt for username:', username);
    const user = await storage.getUserByUsername(username);
    console.log('User found:', user ? 'Yes' : 'No');

    if (user) {
      console.log('User data:', { id: user.id, username: user.username, role: user.role });
      console.log('Stored password hash:', user.password);
      console.log('Input password:', password);

      const passwordMatch = bcrypt.compareSync(password, user.password);
      console.log('Password match:', passwordMatch);

      if (passwordMatch) {
        const token = jwt.sign(
          { userId: user.id, username: user.username, role: user.role },
          JWT_SECRET,
          { expiresIn: '24h' }
        );
        console.log('Login successful, token generated');
        return { user, token };
      } else {
        console.log('Password mismatch');
      }
    } else {
      console.log('User not found');
    }
    return null;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function createUser(firstName: string, fatherName: string, phone: string, password: string) {
  try {
    // Create username from first name and father name
    let username = `${firstName}_${fatherName}`.toLowerCase().replace(/\s+/g, '_');

    // Check if username exists and add number if needed
    let counter = 1;
    let originalUsername = username;
    while (await storage.getUserByUsername(username)) {
      username = `${originalUsername}_${counter}`;
      counter++;
    }

    // Hash the provided password
    const hashedPassword = bcrypt.hashSync(password, 10);

    const userData = {
      username,
      password: hashedPassword,
      role: 'user' as const,
      firstName,
      fatherName,
      phone
    };

    const newUser = await storage.createUser(userData);

    // Create token
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return { user: newUser, token };
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'غير مخول للوصول' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'رمز الوصول غير صالح' });
    }
    (req as any).user = user;
    next();
  });
}

export function getCurrentUser(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}