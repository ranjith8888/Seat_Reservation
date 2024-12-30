const apiRoutes={
    LOGIN:process.env.login || 'http://localhost:8080/auth',
    SIGNUP:process.env.signup || 'http://localhost:8080/signup',
    TICKET:process.env.ticket || 'http://localhost:8080/ticket'
}
export default apiRoutes;