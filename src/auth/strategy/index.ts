// export to be imported in AuthModule

// Is used to protect routes with strategy
// can access a route only if user has valid strategy (JWT)

// Process:
// Generate token in AuthService
// Then Strategy decorates other routes (auth/... routes)

export * from './jwt.strategy';
