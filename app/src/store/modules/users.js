import axios from '@/axios'
import router from '@/router'

export default {
    state: {
        userToken: null,
        loggedIn: false,
        user: null
    },
    getters: {
        loggedIn: state => state.loggedIn,
        user: state => state.user 
    },
    mutations: {
        SET_USER: (state, token) => {
            if(token) {
                state.userToken = token
                state.loggedIn = true
            } 
            else {
                state.userToken = null
                state.loggedIn = false
            }
            
        },
        CHECK_USER: state => {
            try {
                let token = localStorage.getItem('token')
                if(token) {
                    state.userToken = token
                    state.loggedIn = true
                } else {
                    state.userToken = null
                    state.loggedIn = false
                }
            }
            catch(err) {
                console.loggedIn(err)
            }
        },
        GET_A_USER: (state, user) => {
            state.user = user
        },
        CLEAR_USER: state => state.user = null
    },
    actions: {
        register: async ({dispatch}, _user) => {
            const user = {
                email: _user.email,
                password: _user.password
            }
            await axios.post('/users/register', _user)
            dispatch('login', {user})
        },
        login: ({ commit }, payload) => {
            axios.post('/users/login', payload.user)
                .then(res => {
                    if(res.status === 200) {

                        localStorage.setItem('token', res.data.token)
                        commit('SET_USER', res.data.token)

                        if(payload.route) {
                            router.push(payload.route)
                        } else {
                            router.push('/')
                        }
                    }
                })
        },
        checkUser: ({commit}) => {
            commit('CHECK_USER')
        },
        logout: ({commit}) => {
            let token = localStorage.getItem('token')
            if(token) {
                localStorage.removeItem('token')
                commit('SET_USER', null)
            } 
        },
        getAUser: async ({commit}, id) => {
            const res = await axios.get('users/' + id)
            commit('GET_A_USER', res.data)
        },
        clearUser: ({commit}) => {
            commit('CLEAR_USER')
        }
    }
}