
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import User from '../models/User';

// Fix: Use any for req and res to resolve "Property 'body' and 'json' does not exist" errors
export const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // In a real app, use bcrypt to compare hashes
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Fix: Use any for req and res
export const register = async (req: any, res: any) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
};
