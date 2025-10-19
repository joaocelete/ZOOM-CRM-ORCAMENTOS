import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { Express, Request, Response, NextFunction } from "express";
import type { IStorage } from "./storage";
import type { User } from "@shared/schema";

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export type UserRole = "admin" | "salesperson" | "employee";

export function setupPassport(storage: IStorage) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          
          if (!user) {
            return done(null, false, { message: "Email ou senha incorretos" });
          }

          if (!user.isActive) {
            return done(null, false, { message: "Usuário desativado" });
          }

          const isValidPassword = await comparePassword(password, user.passwordHash);
          
          if (!isValidPassword) {
            return done(null, false, { message: "Email ou senha incorretos" });
          }

          await storage.updateUserLastLogin(user.id);

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      
      if (!user || !user.isActive) {
        return done(null, false);
      }
      
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Não autenticado" });
}

export function authorizeRoles(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const user = req.user as User;
    
    if (!roles.includes(user.role as UserRole)) {
      return res.status(403).json({ message: "Sem permissão" });
    }

    next();
  };
}

export function isAdmin(req: Request): boolean {
  return req.isAuthenticated() && (req.user as User).role === "admin";
}
