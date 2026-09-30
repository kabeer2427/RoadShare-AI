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

export const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    await authService.logoutUser(token);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
      message: 'Profile retrieved'
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordRequest = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });
    
    const { error } = await authService.requestPasswordReset(email);
    if (error) throw error;
    
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordReset = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    
    const { error } = await authService.resetPassword(email, token, newPassword);
    if (error) throw error;
    
    res.status(200).json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};
