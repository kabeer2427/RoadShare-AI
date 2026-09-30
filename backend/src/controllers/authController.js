import { registerSchema, loginSchema } from '../validators/authValidators.js';
import * as authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const session = await authService.registerUser(validatedData);
    
    res.status(201).json({
      success: true,
      data: session,
      message: 'Registration successful'
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const session = await authService.loginUser(validatedData);
    
    res.status(200).json({
      success: true,
      data: session,
      message: 'Login successful'
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // req.user is populated by auth middleware
    res.status(200).json({
      success: true,
      data: req.user,
      message: 'Profile retrieved'
    });
  } catch (error) {
    next(error);
  }
};
